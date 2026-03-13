import { faker } from "@faker-js/faker";
import { drizzle } from "drizzle-orm/node-postgres";
import { issues, submissions } from "./schema";

const TOTAL_SUBMISSIONS = 100;

const languages = [
	"javascript",
	"typescript",
	"python",
	"sql",
	"go",
	"rust",
	"java",
	"ruby",
	"php",
	"c",
] as const;

const verdicts = [
	"needs_serious_help",
	"below_average",
	"average",
	"above_average",
	"impressive",
	"legendary",
] as const;

const severities = ["critical", "warning", "good"] as const;

const codeSnippets: Record<string, string[]> = {
	javascript: [
		`function fetchData() {
  var data = null;
  $.ajax({
    url: "/api/data",
    async: false,
    success: function(response) {
      data = response;
    }
  });
  return data;
}`,
		`eval(prompt("enter code"));
document.write(response);
// trust the user lol`,
		`if (x == true) { return true; }
else if (x == false) { return false; }
else { return !false; }`,
		`for (var i = 0; i < arr.length; i++) {
  for (var j = 0; j < arr[i].length; j++) {
    for (var k = 0; k < arr[i][j].length; k++) {
      console.log(arr[i][j][k]);
    }
  }
}`,
		`function add(a, b) {
  return parseInt(a) + parseInt(b);
}
// works for numbers too!`,
		`try {
  doSomething();
} catch(e) {
  // ignore
}`,
		`const sleep = (ms) => {
  const start = Date.now();
  while (Date.now() - start < ms) {}
};`,
		`document.getElementById("btn").onclick = function() {
  document.getElementById("result").innerHTML = 
    "<script>alert('xss')</script>";
};`,
	],
	typescript: [
		`function processData(data: any): any {
  return data as any;
}`,
		`const result: any = {};
(result as any).value = (input as any).data;
return result as any;`,
		`interface User {
  name: string;
  age: number;
}
// @ts-ignore
const user: User = { name: 123, age: "old" };`,
		`enum Direction {
  Up = "UP",
  Down = "DOWN", 
  Left = "LEFT",
  Right = "RIGHT",
}
function move(d: string) {
  if (d === "UP") console.log("moving up");
}`,
	],
	python: [
		`def process_data(raw):
    data = eval(raw)
    # what could go wrong?`,
		`import os
password = "admin123"
os.system(f"mysql -u root -p{password} -e 'DROP TABLE users'")`,
		`def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
# it's fine for n=100, right?`,
		`from time import sleep
while True:
    data = fetch_api()
    process(data)
    # no sleep needed`,
	],
	sql: [
		`SELECT * FROM users WHERE 1=1
-- TODO: add authentication`,
		`DELETE FROM orders WHERE id = ' + req.params.id + ';
-- safe enough`,
		"SELECT * FROM users \nWHERE password = '\" + userInput + \"'\nAND username = '\" + username + \"';",
	],
	go: [
		`func handler(w http.ResponseWriter, r *http.Request) {
    body, _ := io.ReadAll(r.Body)
    json.Unmarshal(body, &data)
    fmt.Fprintf(w, string(body))
}`,
		`func divide(a, b int) int {
    return a / b
}`,
	],
	rust: [
		`fn main() {
    unsafe {
        let ptr = 0x1234 as *mut i32;
        *ptr = 42;
    }
}`,
		`fn parse_input(input: &str) -> i32 {
    input.parse().unwrap()
}`,
	],
	java: [
		`public class Main {
    public static void main(String[] args) {
        String password = "admin123";
        if (args[0].equals(password)) {
            System.out.println("Access granted");
        }
    }
}`,
		`public boolean equals(Object o) {
    return this.toString() == o.toString();
}`,
	],
	ruby: [
		`def is_admin?(user)
  user.role == "admin" || true
end`,
		`system("rm -rf #{params[:path]}")`,
	],
	php: [
		`<?php
$query = "SELECT * FROM users WHERE id = " . $_GET['id'];
mysql_query($query);
?>`,
		`<?php
if ($_POST['password'] == "secret") {
    $_SESSION['admin'] = true;
}
?>`,
	],
	c: [
		`void copy_string(char *dest, char *src) {
    while (*src) {
        *dest++ = *src++;
    }
}
// buffer overflow? never heard of it`,
		`int main() {
    char buffer[10];
    gets(buffer);
    printf(buffer);
    return 0;
}`,
	],
};

const issueTitles: Record<string, { title: string; description: string }[]> = {
	critical: [
		{
			title: "SQL injection vulnerability",
			description:
				"user input is concatenated directly into the query string. use parameterized queries or an ORM to prevent injection attacks.",
		},
		{
			title: "using eval() on user input",
			description:
				"eval() executes arbitrary code and should never be used with untrusted input. this is a critical security vulnerability.",
		},
		{
			title: "hardcoded credentials",
			description:
				"passwords and secrets should never be hardcoded. use environment variables or a secrets manager.",
		},
		{
			title: "using var instead of const/let",
			description:
				"var is function-scoped and leads to hoisting bugs. use const by default, let when reassignment is needed.",
		},
		{
			title: "no error handling",
			description:
				"silently swallowing errors makes debugging nearly impossible. always handle or propagate errors explicitly.",
		},
		{
			title: "command injection risk",
			description:
				"user input is passed directly to a shell command. sanitize inputs and avoid shell execution when possible.",
		},
		{
			title: "unsafe memory access",
			description:
				"directly dereferencing raw pointers without validation can cause segfaults or undefined behavior.",
		},
		{
			title: "synchronous blocking operation",
			description:
				"blocking the event loop with synchronous operations kills performance. use async alternatives.",
		},
	],
	warning: [
		{
			title: "imperative loop pattern",
			description:
				"for loops are verbose and error-prone. use .reduce() or .map() for cleaner, functional transformations.",
		},
		{
			title: "magic numbers without constants",
			description:
				"unexplained numeric literals make code harder to understand. extract them into named constants.",
		},
		{
			title: "deeply nested callbacks",
			description:
				"callback hell makes code unreadable. refactor using async/await or promises.",
		},
		{
			title: "no input validation",
			description:
				"trusting user input without validation leads to bugs and security issues. always validate and sanitize.",
		},
		{
			title: "using any type extensively",
			description:
				"overusing 'any' defeats the purpose of TypeScript. use proper types or generics.",
		},
		{
			title: "missing error boundaries",
			description:
				"unhandled promise rejections and missing try-catch blocks will crash in production.",
		},
		{
			title: "no rate limiting",
			description:
				"api calls in a tight loop without rate limiting will get you throttled or banned.",
		},
	],
	good: [
		{
			title: "clear naming conventions",
			description:
				"descriptive, self-documenting names that communicate intent without needing comments.",
		},
		{
			title: "single responsibility",
			description:
				"the function does one thing well — no side effects, no mixed concerns, no hidden complexity.",
		},
		{
			title: "consistent code style",
			description:
				"uniform formatting and patterns throughout the code make it easy to read and maintain.",
		},
		{
			title: "proper use of language features",
			description:
				"leveraging modern language features effectively instead of reinventing the wheel.",
		},
	],
};

const roastQuotes = [
	"this code looks like it was written during a power outage... in 2005.",
	"I've seen better error handling in a toaster.",
	"this code doesn't just have bugs, it's an entire ecosystem.",
	"did you write this with your eyes closed? because that's the only excuse.",
	"congratulations, you've invented a new kind of technical debt.",
	"this makes spaghetti code look like a michelin-star dish.",
	"even stack overflow would refuse to help with this.",
	"the only thing this code is good at is generating job security.",
	"I'd say this needs a refactor, but that implies there's something worth saving.",
	"if code reviews were a sport, this would be a participation trophy.",
	"this is what happens when you copy from the wrong stack overflow answer.",
	"your code is like a mystery novel — nobody knows what it does, including you.",
	"I've seen cleaner code in a captcha.",
	"this function has more side effects than an experimental medication.",
	"the variable naming here would make a cryptographer proud.",
	"this is the coding equivalent of duct tape and prayers.",
	"at least it runs... probably.",
	"honestly, not the worst I've seen today. but it's early.",
	"solid fundamentals here. just needs a complete rewrite.",
	"this code has character. unfortunately, that character is a villain.",
	"whoever wrote this clearly values job security over readability.",
	"the only pattern I see here is chaos.",
	"this would make a great example in a 'what not to do' tutorial.",
	"it works, but at what cost? at what cost?",
	"this code ages like milk, not wine.",
];

function scoreToVerdict(score: number) {
	if (score < 3) return "needs_serious_help" as const;
	if (score < 5) return "below_average" as const;
	if (score < 6.5) return "average" as const;
	if (score < 8) return "above_average" as const;
	if (score < 9.5) return "impressive" as const;
	return "legendary" as const;
}

function generateIssuesForSubmission(score: number) {
	const issueCount = faker.number.int({ min: 2, max: 5 });
	const result: {
		severity: (typeof severities)[number];
		title: string;
		description: string;
		position: number;
	}[] = [];

	for (let i = 0; i < issueCount; i++) {
		let severity: (typeof severities)[number];

		if (score < 3) {
			severity = faker.helpers.weightedArrayElement([
				{ value: "critical", weight: 5 },
				{ value: "warning", weight: 3 },
				{ value: "good", weight: 1 },
			]);
		} else if (score < 6) {
			severity = faker.helpers.weightedArrayElement([
				{ value: "critical", weight: 2 },
				{ value: "warning", weight: 5 },
				{ value: "good", weight: 2 },
			]);
		} else {
			severity = faker.helpers.weightedArrayElement([
				{ value: "critical", weight: 1 },
				{ value: "warning", weight: 2 },
				{ value: "good", weight: 5 },
			]);
		}

		const pool = issueTitles[severity];
		const pick = faker.helpers.arrayElement(pool);

		result.push({
			severity,
			title: pick.title,
			description: pick.description,
			position: i,
		});
	}

	return result;
}

async function seed() {
	const db = drizzle(process.env.DATABASE_URL!, { casing: "snake_case" });

	console.log("Cleaning existing data...");
	await db.delete(issues);
	await db.delete(submissions);

	console.log(`Seeding ${TOTAL_SUBMISSIONS} submissions...`);

	for (let i = 0; i < TOTAL_SUBMISSIONS; i++) {
		const lang = faker.helpers.arrayElement(languages);
		const snippets = codeSnippets[lang];
		const code = faker.helpers.arrayElement(snippets);
		const lineCount = code.split("\n").length;
		const score = faker.number.float({ min: 0.5, max: 9.8, fractionDigits: 1 });
		const verdict = scoreToVerdict(score);

		const [submission] = await db
			.insert(submissions)
			.values({
				code,
				language: lang,
				lineCount,
				roastMode: faker.datatype.boolean({ probability: 0.7 }),
				score: score.toFixed(1),
				roastQuote: faker.helpers.arrayElement(roastQuotes),
				verdict,
				suggestedFix: faker.datatype.boolean({ probability: 0.8 })
					? `// improved version\n${code.split("\n").slice(0, 3).join("\n")}\n// ... refactored`
					: null,
				createdAt: faker.date.recent({ days: 30 }),
			})
			.returning({ id: submissions.id });

		const issueData = generateIssuesForSubmission(score);

		if (issueData.length > 0) {
			await db.insert(issues).values(
				issueData.map((issue) => ({
					submissionId: submission.id,
					...issue,
				})),
			);
		}

		if ((i + 1) % 25 === 0) {
			console.log(`  ${i + 1}/${TOTAL_SUBMISSIONS} done`);
		}
	}

	console.log("Seed complete!");
	process.exit(0);
}

seed().catch((err) => {
	console.error("Seed failed:", err);
	process.exit(1);
});
