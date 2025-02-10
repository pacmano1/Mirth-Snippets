import os
import glob
from collections import Counter
from datetime import datetime
import sys


def extract_msh_7(hl7_message):
    """Extracts MSH-7 (timestamp) from an HL7 message, handling blank lines and CR/LF issues."""
    try:
        # Normalize line endings (handle \r, \n, and \r\n inconsistencies)
        hl7_message = hl7_message.replace("\r", "\n")

        # Split and remove empty lines
        lines = [line.strip() for line in hl7_message.splitlines() if line.strip()]

        # Find the MSH segment
        msh_line = next((line for line in lines if line.startswith("MSH|")), None)

        if not msh_line:
            print("Warning: No MSH segment found.")
            return None

        # Extract field separator from MSH-1 (should always be '|')
        separator = msh_line[3]  # The 4th character is always the delimiter

        # Split MSH using the correct separator
        msh_fields = msh_line.split(separator)

        if len(msh_fields) <= 6 or not msh_fields[6].strip():
            print(f"Warning: MSH-7 is empty or missing. MSH Line: {msh_line}")
            return None

        timestamp = msh_fields[6].strip()

        # Parse timestamp format YYYYMMDDHHMMSS
        return datetime.strptime(timestamp, "%Y%m%d%H%M%S")

    except Exception as e:
        print(f"Error parsing MSH-7: {e} (HL7 Raw: {hl7_message[:100]})")
        return None


def calculate_max_messages_per_second(file_pattern, top_n):
    """Efficiently calculates the max messages per second from HL7 messages."""
    message_counts = Counter()

    file_list = glob.glob(file_pattern)
    print(f"Processing {len(file_list)} HL7 files...")

    for filepath in file_list:
        try:
            with open(filepath, "r", encoding="utf-8") as file:
                hl7_message = file.read()
                timestamp = extract_msh_7(hl7_message)

                if timestamp:
                    timestamp_key = timestamp.strftime("%Y-%m-%d %H:%M:%S")
                    message_counts[timestamp_key] += 1
        except Exception as e:
            print(f"Error reading file {filepath}: {e}")

    if not message_counts:
        print("No valid timestamps found. Ensure MSH-7 exists and format is correct.")
        return

    sorted_counts = sorted(message_counts.items(), key=lambda x: x[1], reverse=True)[:top_n]
    print(f"Top {top_n} timestamps with highest message counts:")
    for timestamp, count in sorted_counts:
        print(f"{timestamp}: {count}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python script.py '/path/to/files/*.hl7' <top_n>")
        sys.exit(1)

    file_pattern = sys.argv[1]
    top_n = int(sys.argv[2])
    if top_n <= 0 or top_n > 100:
        print("Error: top_n must be a number between 1 and 100.")
        sys.exit(1)

    calculate_max_messages_per_second(file_pattern, top_n)
