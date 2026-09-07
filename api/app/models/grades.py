from pydantic import BaseModel


class GradeTotals(BaseModel):
    a_plus: int
    a: int
    a_minus: int
    b_plus: int
    b: int
    b_minus: int
    c_plus: int
    c: int
    c_minus: int
    d_plus: int
    d: int
    d_minus: int
    f: int
    cr: int
    nc: int
    p: int
    w: int
    i: int
    nf: int
