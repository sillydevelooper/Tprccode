#!/usr/bin/env python3
"""run_program_ingestion_batch.py — orchestrate the program pipeline end to end:
queue -> extract -> export -> audit. Cache-first; NETWORK for cache misses."""
from __future__ import annotations
import subprocess, sys, os
HERE = os.path.dirname(__file__)
STEPS = ["build_program_ingestion_queue.py", "extract_programs.py", "export_programs.py", "audit_programs.py"]
def main():
    for s in STEPS:
        print(f"\n>>> {s}")
        r = subprocess.run([sys.executable, os.path.join(HERE, s)])
        if r.returncode != 0 and s == "audit_programs.py":
            print("Denetim hard-fail verdi; export gözden geçirilmeli."); sys.exit(1)
if __name__ == "__main__":
    main()
