CREATE OR REPLACE FUNCTION search_jobs(
    query_vector vector, 
    limit_count int
)
RETURNS SETOF job AS $$
    SELECT *
    FROM job
    ORDER BY embedding <=> query_vector
    LIMIT limit_count;
$$ LANGUAGE sql STABLE;
