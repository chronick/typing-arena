.PHONY: serve serve-test test test-cli test-watch clean help

PORT ?= 8080
TEST_PORT ?= 8081

help:
	@echo "TypeRacer Arena - Typing Competition Game"
	@echo ""
	@echo "Usage:"
	@echo "  make serve      - Start game server on port $(PORT)"
	@echo "  make serve-test - Start test server on port $(TEST_PORT)"
	@echo "  make test       - Run tests via curl (requires serve-test)"
	@echo "  make test-cli   - Run tests via Node.js (no server needed)"
	@echo "  make clean      - Remove generated files"
	@echo "  make help       - Show this help message"
	@echo ""
	@echo "Options:"
	@echo "  PORT=XXXX       - Custom game server port (default: 8080)"
	@echo "  TEST_PORT=XXXX  - Custom test server port (default: 8081)"
	@echo ""
	@echo "Testing:"
	@echo "  1. Run: make serve-test"
	@echo "  2. In another terminal: make test"
	@echo "  3. Or open: http://localhost:$(TEST_PORT)/"
	@echo ""
	@echo "Curl validation:"
	@echo "  curl -s http://localhost:$(TEST_PORT)/api.html | grep -o '\"passed\":[^,]*'"

serve:
	@echo "Starting TypeRacer Arena on http://localhost:$(PORT)"
	@cd src && python3 -m http.server $(PORT)

serve-test:
	@echo "Starting Test Server on http://localhost:$(TEST_PORT)"
	@echo "Run 'make test' in another terminal to execute tests"
	@echo ""
	@cd __tests__ && python3 -m http.server $(TEST_PORT)

test:
	@echo "Running tests..."
	@echo ""
	@curl -s http://localhost:$(TEST_PORT)/api.html 2>/dev/null | \
		python3 -c "import sys,re; \
			content=sys.stdin.read(); \
			match=re.search(r'<pre[^>]*>(.+?)</pre>', content, re.DOTALL); \
			print(match.group(1) if match else 'Error: Could not parse test output')" | \
		python3 -c "import sys,json; \
			data=json.loads(sys.stdin.read()); \
			print('='*60); \
			print('TEST RESULTS'); \
			print('='*60); \
			print(f\"Status: {'PASS' if data['passed'] else 'FAIL'}\"); \
			print(f\"Passed: {data['summary']['passed']}/{data['summary']['total']}\"); \
			print(f\"Failed: {data['summary']['failed']}\"); \
			print(f\"Duration: {data['duration']}ms\"); \
			print('='*60); \
			[print(f\"{'✓' if t['passed'] else '✗'} [{t['group']}] {t['name']}\") for t in data['tests']]; \
			print('='*60); \
			sys.exit(0 if data['passed'] else 1)"

test-json:
	@curl -s http://localhost:$(TEST_PORT)/api.html 2>/dev/null | \
		python3 -c "import sys,re; \
			content=sys.stdin.read(); \
			match=re.search(r'<pre[^>]*>(.+?)</pre>', content, re.DOTALL); \
			print(match.group(1) if match else '{\"error\": \"parse failed\"}')"

test-summary:
	@curl -s http://localhost:$(TEST_PORT)/api.html 2>/dev/null | \
		python3 -c "import sys,re,json; \
			content=sys.stdin.read(); \
			match=re.search(r'<pre[^>]*>(.+?)</pre>', content, re.DOTALL); \
			data=json.loads(match.group(1)) if match else {}; \
			print(json.dumps({'passed': data.get('passed'), 'summary': data.get('summary')}))"

test-cli:
	@node __tests__/run-tests.js

test-cli-json:
	@node __tests__/run-tests.js --json

clean:
	@echo "Cleaning up..."
	@find . -name "*.pyc" -delete
	@find . -name "__pycache__" -type d -delete
	@echo "Done."
