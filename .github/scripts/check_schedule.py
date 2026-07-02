#!/usr/bin/env python3
"""Decide whether the daily scheduled rebuild needs to actually run.

The homepage's featured-conference logic (data/conferences.toml) only
changes output on specific days: a conference's start/end dates, its
abstract/registration window edges, and the Jan 1 year rollover (which
changes which conference is featured). On every other day a rebuild would
produce byte-identical output, so `schedule`-triggered workflow runs are
gated on this script instead of always building.
"""
import datetime
import os
import pathlib
import sys
import tomllib

REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
DATE_FIELDS = ("start_date", "end_date", "abstract_open", "abstract_close", "registration_open")


def trigger_dates() -> set[datetime.date]:
    data = tomllib.loads((REPO_ROOT / "data" / "conferences.toml").read_text())
    dates = set()
    for conf in data.get("conferences", []):
        for field in DATE_FIELDS:
            if field in conf:
                dates.add(conf[field])
        timeline = conf.get("timeline", {})
        for field in DATE_FIELDS:
            if field in timeline:
                dates.add(timeline[field])
    return dates


def main() -> None:
    today = datetime.datetime.now(datetime.timezone.utc).date()
    is_year_rollover = today.month == 1 and today.day == 1
    should_build = is_year_rollover or today in trigger_dates()

    print(f"today={today} should_build={should_build}", file=sys.stderr)

    github_output = pathlib.Path(os.environ.get("GITHUB_OUTPUT", "/dev/stdout"))
    with open(github_output, "a") as f:
        f.write(f"should_build={'true' if should_build else 'false'}\n")


if __name__ == "__main__":
    main()
