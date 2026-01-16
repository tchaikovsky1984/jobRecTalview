import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import JobPrepPage from '../JobPrepPage';
import { api } from '../../services/api';

vi.mock('../../services/api', () => ({
  api: {
    post: vi.fn()
  }
}));

vi.mock('../../components/ScoreRing', () => ({
  default: ({ score }: { score: number }) => <div data-testid="score-ring">{score}%</div>
}));

vi.mock('../../components/SkillPill', () => ({
  default: ({ name, variant }: { name: string, variant: string }) => (
    <div data-testid={`pill-${variant}`}>{name}</div>
  )
}));

const alertMock = vi.fn();
window.alert = alertMock;

const mockUser = {
  user_id: "1",
  username: "testusername",
  email: 'test@example.com',
  access_token: 'fake-token',
  name: 'Test User',
  message: "logged in"
};

const mockJobData = {
  job: { title: 'Frontend Engineer', company: 'TechCorp', location: 'Remote' },
  score: 85,
  skill_matches: ['React', 'TypeScript'],
  skill_misses: ['Java'],
  reasoning: 'Good fit because...',
  prep: []
};

const mockPrepData = {
  topics: ['System Design', 'React Hooks'],
  tips: ['Be confident', 'Speak clearly'],
  questions: [
    { topic: 'React', question: 'Explain useEffect', answer: 'It handles side effects' }
  ]
};

describe('JobPrepPage', () => {
  const postMock = vi.mocked(api.post);

  const renderWithRouter = (recId = '123') => {
    return render(
      <MemoryRouter initialEntries={[`/prep/${recId}`]}>
        <Routes>
          <Route path="/prep/:id" element={<JobPrepPage user={mockUser} />} />
          <Route path="/app/jobs" element={<h1>Jobs Dashboard</h1>} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const setupLoadedPage = async () => {
    if (postMock.mock.calls.length === 0 && !postMock.getMockImplementation()) {
      postMock.mockResolvedValue({
        data: { recommendation_by_pk: mockJobData }
      });
    }

    renderWithRouter();

    await screen.findByText('Frontend Engineer', {}, { timeout: 2000 });
  };

  it('shows loading state initially', async () => {
    postMock.mockImplementation(() => new Promise(() => { }));
    renderWithRouter();
    expect(screen.getByText(/Loading Prep Context/i)).toBeInTheDocument();
  });

  it('renders job details and skills upon successful load', async () => {
    postMock.mockResolvedValue({
      data: { recommendation_by_pk: mockJobData }
    });
    renderWithRouter();
    expect(await screen.findByText('Frontend Engineer')).toBeInTheDocument();
  });

  it('redirects to /app/jobs if recommendation is not found', async () => {
    postMock.mockResolvedValue({ data: { recommendation_by_pk: null } });
    renderWithRouter();

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Recommendation not found");
      expect(screen.getByText('Jobs Dashboard')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully during load', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    postMock.mockRejectedValue(new Error("Network Error"));
    renderWithRouter();

    await waitFor(() => expect(consoleSpy).toHaveBeenCalled());
    expect(screen.getByText(/Loading Prep Context/i)).toBeInTheDocument();
  });

  it('handles immediate failure of the generation trigger API', async () => {
    // Note: No fake timers needed here because we fail BEFORE the interval starts
    postMock.mockResolvedValue({ data: { recommendation_by_pk: mockJobData } });
    await setupLoadedPage();

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    postMock.mockRejectedValueOnce(new Error("Trigger Failed"));

    fireEvent.click(screen.getByRole('button', { name: /Generate Interview Prep/i }));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Failed to start generation workflow");
    });
  });

  it('renders Focus Topics and Tips correctly when prep exists', async () => {
    const dataWithPrep = { ...mockJobData, prep: [mockPrepData] };
    postMock.mockResolvedValue({
      data: { recommendation_by_pk: dataWithPrep }
    });

    renderWithRouter();

    expect(await screen.findByText('Focus Topics')).toBeInTheDocument();
    expect(screen.getByText('System Design')).toBeInTheDocument();
  });
});
