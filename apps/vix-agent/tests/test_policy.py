from hypothesis import given
from hypothesis import strategies as st

from vix_agent.policy import violates

UNITS = ["s", "cm", "m/s^2", "cm³", "mol dm-3", "V", "A", "GPa", "mm"]


@given(st.floats(min_value=0.01, max_value=999, allow_nan=False).map(lambda f: round(f, 2)), st.sampled_from(UNITS))
def test_graded_blocks_any_number_with_unit(value, unit):
    assert violates(f"I think it is {value} {unit} here.", "GRADED") is not None


def test_graded_allows_guiding_question():
    assert violates("What happens to your timing error if you count 20 swings instead of one?", "GRADED") is None


def test_graded_blocks_answer_phrase():
    assert violates("Your g is close to the textbook value.", "GRADED") is not None


def test_practice_allows_numbers():
    assert violates("Try a length of 60 cm next.", "PRACTICE") is None


def test_never_claims_to_act():
    assert violates("Let me submit that for you.", "PRACTICE") is not None
