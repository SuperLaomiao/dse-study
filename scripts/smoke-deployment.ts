import {
  getDeploymentSmokeTargets,
  getSmokeFailure,
  summarizeSmokeFailures
} from "@/lib/smoke";

const baseUrl = process.env.SMOKE_BASE_URL?.trim();

if (!baseUrl) {
  console.error("SMOKE_BASE_URL is required.");
  process.exit(1);
}

async function main() {
  const failures: string[] = [];

  for (const target of getDeploymentSmokeTargets()) {
    const url = new URL(target.path, baseUrl).toString();

    try {
      const response = await fetch(url, {
        redirect: "follow",
        headers: {
          Accept: "text/html"
        }
      });
      const body = await response.text();

      if (!response.ok) {
        failures.push(`${target.path} returned ${response.status}`);
        continue;
      }

      const bodyFailure = getSmokeFailure(target.path, body, target.expectAnyText);

      if (bodyFailure) {
        failures.push(bodyFailure);
      }
    } catch (error) {
      failures.push(`${target.path} failed with ${(error as Error).message}`);
    }
  }

  if (failures.length > 0) {
    const summarizedFailures = summarizeSmokeFailures(failures);

    console.error("Deployment smoke check failed:");
    for (const failure of summarizedFailures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log("Deployment smoke check passed.");
}

void main();
