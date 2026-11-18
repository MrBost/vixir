"""Worker entrypoint. Run: uv run python -m vix_agent.main dev

TODO (vix-agent spec): wire STT/TTS providers, the LangGraph graph, ScreenMap topic and RPC wrappers.
Check the current LiveKit Agents docs for the exact worker API of the installed version before building on this.
"""
import logging

from livekit.agents import Agent, AgentSession, JobContext, WorkerOptions, cli

logger = logging.getLogger("vix")

INSTRUCTIONS = (
    "You are Vix, a warm, brief lab guide for secondary and university students in Nigeria. "
    "Explain the lab screen and guide the practical with questions. Never give readings or answers in graded mode."
)


async def entrypoint(ctx: JobContext) -> None:
    await ctx.connect()
    logger.info("vix joined room %s", ctx.room.name)
    session = AgentSession()  # TODO: stt=..., llm=..., tts=..., vad=..., turn_detection=...
    await session.start(room=ctx.room, agent=Agent(instructions=INSTRUCTIONS))


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, agent_name="vix"))
