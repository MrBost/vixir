"""Pydantic mirror of steering contracts.md §4–7. Keep in sync with packages/screen-map/src/index.ts."""
from typing import Literal

from pydantic import BaseModel, Field

Mode = Literal["PRACTICE", "GRADED", "EXAM"]
RegionKind = Literal["panel", "instrument", "control", "apparatus", "chart", "table"]
RPC_METHODS = ("spotlight", "pointAt", "startTour", "tourStep", "endTour", "openPanel", "showCaption")


class Region(BaseModel):
    id: str
    label: str
    kind: RegionKind
    bbox: tuple[int, int, int, int]
    visible: bool
    summary: str | None = None


class ExperimentRef(BaseModel):
    id: str
    title: str
    step: str


class ScreenMap(BaseModel):
    v: Literal[1] = 1
    screen: str
    route: str
    mode: Mode
    experiment: ExperimentRef | None = None
    viewport: dict[str, int]
    regions: list[Region] = Field(default_factory=list)
    sim: dict | None = None
    lastEvents: list[dict] | None = None

    def has_id(self, region_or_element_id: str) -> bool:
        return any(r.id == region_or_element_id or region_or_element_id.startswith(r.id + ".") for r in self.regions)


class SessionContext(BaseModel):
    mode: Mode
    locale: str = "en"
    firstName: str
    experiment: dict | None = None
