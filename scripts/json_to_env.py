import json
import sys

def json_to_env(json_file, env_file):
    try:
        with open(json_file, 'r') as jfile:
            data = json.load(jfile)
    except json.JSONDecodeError as e:
        print(f"Error reading JSON file {json_file}: {e}")
        sys.exit(1)

    with open(env_file, 'w') as efile:
        for item in data:
            efile.write(f"{item['name']}={item['value']}\n")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python json_to_env.py <input_json_file> <output_env_file>")
        sys.exit(1)

    json_to_env(sys.argv[1], sys.argv[2])
