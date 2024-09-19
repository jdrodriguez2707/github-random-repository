document.addEventListener("DOMContentLoaded", async () => {
  // Programming languages select
  const programmingLanguagesSelect = document.querySelector(
    "#programming-languages"
  );

  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json"
    );
    const programmingLanguages = await response.json();
    console.log(programmingLanguages);

    programmingLanguages.forEach((programmingLanguage) => {
      const option = document.createElement("option");
      option.value = programmingLanguage.value;
      option.textContent = programmingLanguage.title;

      programmingLanguagesSelect.appendChild(option);
    });
  } catch (error) {
    console.log(error);
  }

  programmingLanguagesSelect.addEventListener(
    "change",
    onProgrammingLanguageChange
  );
});

const onProgrammingLanguageChange = async (event) => {
  console.log("Select changed!");
  console.log(event.currentTarget.value);
  const programmingLanguageSelected = event.currentTarget.value;

  // Request states
  const requestStatesDiv = document.querySelector("#request-state");
  const requestStateText = requestStatesDiv.firstElementChild;
  requestStateText.textContent = "Loading, please wait...";

  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=language:${programmingLanguageSelected}&sort=stars&order=desc`
    );
    const repositories = await response.json();

    const repositoryName =
      repositories.items[getRandomIndex(repositories.items.length)].name;

    const repositoryDescription =
      repositories.items[getRandomIndex(repositories.items.length)].description;

    const repositoryLanguage =
      repositories.items[getRandomIndex(repositories.items.length)].language;

    const repositoryStars =
      repositories.items[getRandomIndex(repositories.items.length)]
        .stargazers_count;

    const repositoryForks =
      repositories.items[getRandomIndex(repositories.items.length)].forks;

    const repositoryOpenIssues =
      repositories.items[getRandomIndex(repositories.items.length)]
        .open_issues_count;

    console.log(
      `Name: ${repositoryName}\nDesc: ${repositoryDescription}\nLang: ${repositoryLanguage}\nStars: ${repositoryStars}\nForks: ${repositoryForks}\nIssues: ${repositoryOpenIssues}`
    );

    displayRandomRepository(
      requestStatesDiv,
      repositoryName,
      repositoryDescription,
      repositoryLanguage,
      repositoryStars,
      repositoryForks,
      repositoryOpenIssues
    );
  } catch (error) {
    console.log(error);
  }
};

function getRandomIndex(arrayLength) {
  return Math.floor(Math.random() * arrayLength);
}

function displayRandomRepository(
  requestStatesDiv,
  name,
  description,
  language,
  stars,
  forks,
  openIssues
) {
  // Request states container
  requestStatesDiv.classList.add("fulfilled-state");
  requestStatesDiv.removeChild(requestStatesDiv.firstElementChild);

  // Repository name h2
  const repositoryName = document.createElement("h2");
  repositoryName.classList.add("repository-name");
  repositoryName.textContent = name;

  // Repository description paragraph
  const repositoryDescription = document.createElement("p");
  repositoryDescription.classList.add("repository-description");
  repositoryDescription.textContent = description;

  // Repository stats container
  const repositoryStatsContainer = document.createElement("div");
  repositoryStatsContainer.classList.add("repository-stats");

  // Repository language container
  const languageContainer = document.createElement("div");
  const repositoryLanguage = document.createElement("p");
  repositoryLanguage.innerText = language;
  languageContainer.appendChild(repositoryLanguage);

  // Repository stars container
  const starsContainer = document.createElement("div");
  starsContainer.classList.add("stats-with-icon-container");
  const starIcon = document.createElement("img");
  starIcon.classList.add("stats-icon");
  starIcon.src = "./assets/icons/star.svg";
  starIcon.alt = "GitHub stars";
  const repositoryStars = document.createElement("p");
  repositoryStars.textContent = stars;
  starsContainer.append(starIcon, repositoryStars);

  // Repository forks container
  const forksContainer = document.createElement("div");
  forksContainer.classList.add("stats-with-icon-container");
  const forksIcon = document.createElement("img");
  forksIcon.classList.add("stats-icon");
  forksIcon.src = "./assets/icons/git-fork.svg";
  forksIcon.alt = "GitHub forks";
  const repositoryForks = document.createElement("p");
  repositoryForks.textContent = forks;
  forksContainer.append(forksIcon, repositoryForks);

  // Repository open issues container
  const openIssuesContainer = document.createElement("div");
  openIssuesContainer.classList.add("stats-with-icon-container");
  const issuesIcon = document.createElement("img");
  issuesIcon.classList.add("stats-icon");
  issuesIcon.src = "./assets/icons/circle-alert.svg";
  issuesIcon.alt = "GitHub issues";
  const repositoryOpenIssues = document.createElement("p");
  repositoryOpenIssues.textContent = openIssues;
  openIssuesContainer.append(issuesIcon, repositoryOpenIssues);

  repositoryStatsContainer.append(
    languageContainer,
    starsContainer,
    forksContainer,
    openIssuesContainer
  );

  requestStatesDiv.append(
    repositoryName,
    repositoryDescription,
    repositoryStatsContainer
  );
}
