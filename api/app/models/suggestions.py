from pydantic import BaseModel


class SuggestionsResponse(BaseModel):
    professors: list[str]
    courses: list[str]
