from typing import List

def to_pg_array(arr: List[str] | None) -> str:
    if arr is None:
        return '{}'

    formatted = [f'"{s.replace("\"", "\\\"")}"' for s in arr]
    
    return "{" + ",".join(formatted) + "}"
