"""Rule half of the Policy_Guard (vix-agent Req 6). The LLM classifier half lives in graph/policy later."""
import re

from .contracts import Mode

_UNITS = r"(?:m/s\^?2|m\s?s-?2|m\s?s⁻²|cm³|cm3|mol\s?dm-?3|mol/dm3|s²|s\^?2|s|cm|mm|m|kg|g|n|a|v|ω|ohms?|gpa|pa|°c|%)"
_NUMBER_WITH_UNIT = re.compile(rf"(?<![\w.])-?\d+(?:[.,]\d+)?\s?{_UNITS}(?![a-z])", re.IGNORECASE)
_ANSWER_PHRASES = re.compile(
    r"\b(the answer is|your (?:g|value|slope|result|titre|reading|concentration) (?:is|should be|=)|"
    r"(?:g|slope|titre|resistance|concentration)\s*(?:=|is about|is roughly|equals)\s*-?\d)",
    re.IGNORECASE,
)
_FORBIDDEN_ACTIONS = re.compile(r"\b(i(?:'ve| have) (?:submitted|changed|recorded)|let me (?:submit|change|record))\b", re.IGNORECASE)


def violates(message: str, mode: Mode) -> str | None:
    """Return a reason string if the message breaks the mode policy, else None."""
    if _FORBIDDEN_ACTIONS.search(message):
        return "claims to act on the experiment"
    if mode == "GRADED":
        if _ANSWER_PHRASES.search(message):
            return "states an answer"
        if _NUMBER_WITH_UNIT.search(message):
            return "states a measured or derived value"
    return None
