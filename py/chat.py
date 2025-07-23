import sys, json, os
import openai

def main():
    try:
        data = json.load(sys.stdin)
    except json.JSONDecodeError as e:
        print(f"Invalid input: {e}", file=sys.stderr)
        sys.exit(1)

    openai.api_key = os.getenv("OPENAI_API_KEY")
    if not openai.api_key:
        print("OPENAI_API_KEY environment variable not set", file=sys.stderr)
        sys.exit(1)

    model = data.get("model", "gpt-3.5-turbo")
    messages = data.get("messages", [])

    try:
        response = openai.ChatCompletion.create(
            model=model,
            messages=messages,
            stream=True,
        )
        for chunk in response:
            delta = chunk.choices[0].delta.get("content")
            if delta:
                sys.stdout.write(delta)
                sys.stdout.flush()
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()

