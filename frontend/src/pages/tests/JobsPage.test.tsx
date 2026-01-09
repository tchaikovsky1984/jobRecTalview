import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import JobsPage from '../JobsPage';
import { api } from '../../services/api';

vi.mock('../../services/api', () => ({
  api: {
    post: vi.fn()
  }
}));

vi.mock('../../components/JobRow', () => ({
  default: ({ rec }: any) => (
    <div data-testid="job-row">
      {rec.job.title} - {rec.score}
    </div>
  )
}));

const mockUser = {
  user_id: '1',
  username: "testuser",
  message: "logged in",
  email: 'test@example.com',
  access_token: 'fake-token',
  name: 'Test User'
};

const mockRecs = [
  {
    id: 1,
    score: 90,
    skill_matches: ['React', 'TypeScript', 'Node'],
    job: { title: 'Senior Dev' }
  },
  {
    id: 2,
    score: 80,
    skill_matches: ['React', 'TypeScript'],
    job: { title: 'Mid Dev' }
  },
  {
    id: 3,
    score: 70,
    skill_matches: ['React', 'Java'],
    job: { title: 'Junior Dev' }
  }
];

describe('JobsPage', () => {
  const postMock = vi.mocked(api.post);

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <JobsPage user={mockUser} />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders loading state initially', async () => {
    postMock.mockImplementation(() => new Promise(() => { }));

    renderComponent();

    expect(screen.getByText(/Analysing Market/i)).toBeInTheDocument();
  });

  it('renders empty state correctly when API returns no recommendations', async () => {
    postMock.mockResolvedValue({
      data: { recommendation: [] }
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.queryByText(/Analysing Market/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText('Total Opportunities').nextSibling).toHaveTextContent('0');
    expect(screen.getByText('Average Match Score').nextSibling).toHaveTextContent('0%');
    expect(screen.getByText('Top Matched Skill').nextSibling).toHaveTextContent('N/A');

    expect(screen.getByText(/No recommendations yet/i)).toBeInTheDocument();
  });

  it('calculates and displays insights correctly for populated data', async () => {
    postMock.mockResolvedValue({
      data: { recommendation: mockRecs }
    });

    renderComponent();

    await screen.findByText('Total Opportunities');

    const totalEl = screen.getByText('Total Opportunities').nextSibling;
    expect(totalEl).toHaveTextContent('3');

    const avgEl = screen.getByText('Average Match Score').nextSibling;
    expect(avgEl).toHaveTextContent('80%');
    expect(avgEl).toHaveClass('text-green-600');

    const skillEl = screen.getByText('Top Matched Skill').nextSibling;
    expect(skillEl).toHaveTextContent('React');
  });

  it('renders the correct number of JobRow components', async () => {
    postMock.mockResolvedValue({
      data: { recommendation: mockRecs }
    });

    renderComponent();

    await waitFor(() => {
      const rows = screen.getAllByTestId('job-row');
      expect(rows).toHaveLength(3);
    });

    expect(screen.getByText(/Senior Dev/)).toBeInTheDocument();
    expect(screen.getByText(/Mid Dev/)).toBeInTheDocument();
  });

  it('calls the API with correct user parameters', async () => {
    postMock.mockResolvedValue({ data: { recommendation: [] } });

    renderComponent();

    await waitFor(() => expect(postMock).toHaveBeenCalled());

    expect(postMock).toHaveBeenCalledWith(
      false,
      "",
      expect.objectContaining({
        variables: { userId: Number(mockUser.user_id) }
      }),
      expect.objectContaining({
        "Authorization": "Bearer " + mockUser.access_token
      })
    );
  });

  it('handles API errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    postMock.mockRejectedValue(new Error("API Failure"));

    renderComponent();

    await waitFor(() => {
      expect(screen.queryByText(/Analysing Market/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/No recommendations yet/i)).toBeInTheDocument();

    // Verify error was logged
    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
  });

  it('handles edge case: calculation with data but no skills', async () => {
    const dataNoSkills = [{
      id: 1, score: 50, skill_matches: [], job: { title: 'Job A' }
    }];

    postMock.mockResolvedValue({
      data: { recommendation: dataNoSkills }
    });

    renderComponent();

    await screen.findByText('Top Matched Skill');

    expect(screen.getByText('Top Matched Skill').nextSibling).toHaveTextContent('None');

    expect(screen.getByText('Average Match Score').nextSibling).toHaveTextContent('50%');
  });

});
