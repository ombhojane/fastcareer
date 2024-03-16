let currentQuestionIndex = 1;
let currentSectionIndex = 0;
let userResponses = {};
let repeatableGroupCounter = {};

const sections = [
  {
    // About You Section
    title: "About You",
    questions: [
      { label: "What is your name?", type: "text", id: "name" },
      { label: "What is your mobile number?", type: "number", id: "mobile" },
      { label: "What is your email ID?", type: "email", id: "email" },
      { label: "Your LinkedIn (optional)", type: "text", id: "linkedin" },
      { label: "Your GitHub (optional)", type: "text", id: "github" },
    ],
  },
  {
    // Core Values Section
    title: "Core Values",
    questions: [
      {
        label: "What annoys you or gets under your skin at work?",
        type: "text",
        id: "annoyance",
      },
      { label: "What brings you joy in your work?", type: "text", id: "joy" },
      {
        label:
          "What could you not live without in a workplace or on a work team?",
        type: "text",
        id: "necessity",
      },
      {
        label: "Who do you admire and what do you admire about them?",
        type: "text",
        id: "admire",
      },
    ],
  },
  {
    // Strength Section modified with grouped questions for Exercise 2
    title: "Strength",
    questions: [
      {
        label:
          "Strength Exercise 1 - Self Assessment: What do you enjoy the most?",
        type: "text",
        id: "enjoyMost",
      },
      {
        label: "What am I called on to do most often?",
        type: "text",
        id: "calledOn",
      },
      { label: "What do I do best?", type: "text", id: "doBest" },
      {
        label: "What advice or expertise do others seek from me?",
        type: "text",
        id: "adviceSought",
      },
      {
        // Strength Exercise 2 treated as a single question group for display purposes
        type: "group", // Custom type to handle grouped inputs
        questions: [
          { label: "Story 1", type: "text", id: "story1" },
          { label: "Feedback for Story 1", type: "text", id: "feedback1" },
          { label: "Story 2", type: "text", id: "story2" },
          { label: "Feedback for Story 2", type: "text", id: "feedback2" },
        ],
      },
    ],
  },
  {
    title: "Skills and Experience",
    // Skills and Experience Exercise Section
    questions: [
      {
        label: "Job: Title or description – where and when?",
        type: "text",
        id: "jobDescription",
      },
      {
        label: "Skills and experience: Direct or transferable",
        type: "text",
        id: "skillsExperience",
      },
      {
        label:
          "Accomplishments: Measurable; if possible include examples like percentage of goal, dollars in sales, revenue growth, or savings; number of employees hired or trained",
        type: "text",
        id: "accomplishments",
      },
      {
        label:
          "Benefit to the Employer: how your skills and/or experience benefit the organization and its people",
        type: "text",
        id: "benefitToEmployer",
      },
    ],
  },

  {
    //dream job
    title: "Dream job",
    questions: [
      {
        label:
          "If there were no restrictions (for example, education, location, experience, or financial obligations), my dream job would be:",
        type: "text",
        id: "d1",
      },
      {
        label: "Is obtaining this dream job a realistic possibility for me?",
        type: "radio",
        id: "realisticPossibility",
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ],
      },
      {
        label: "If yes, explain how.",
        type: "text",
        id: "d3",
      },
      {
        label:
          "List at least ten specific attributes of this dream job (for example, content, culture, mission, responsibilities, or perks), as you imagine it, that appeal to you:",
        type: "text",
        id: "d4",
      },
      {
        label: "Working in this dream job would make me feel",
        type: "text",
        id: "d5",
      },
      {
        label: "Working this dream job would fill my need(s) for",
        type: "text",
        id: "d6",
      },
      {
        label: "Working in this dream job would meet my goal(s) of",
        type: "text",
        id: "d7",
      },
    ],
  },
  {
    // Preference Section
    title: "Preferences",
    questions: [
      {
        type: "section",
        title: "Size of Organization",
        questions: [
          { label: "What I think I want", type: "text", id: "sizeWant" },
          {
            label: "What I know I don't want",
            type: "text",
            id: "sizeNotWant",
          },
        ],
      },
      {
        type: "section",
        title: "Type of Organization",
        questions: [
          { label: "What I think I want", type: "text", id: "typeWant" },
          {
            label: "What I know I don't want",
            type: "text",
            id: "typeNotWant",
          },
        ],
      },
      {
        type: "section",
        title: "Industry",
        questions: [
          { label: "What I think I want", type: "text", id: "industryWant" },
          {
            label: "What I know I don't want",
            type: "text",
            id: "industryNotWant",
          },
        ],
      },
      {
        type: "section",
        title: "Department",
        questions: [
          { label: "What I think I want", type: "text", id: "departmentWant" },
          {
            label: "What I know I don't want",
            type: "text",
            id: "departmentNotWant",
          },
        ],
      },
      {
        type: "section",
        title: "Function",
        questions: [
          { label: "What I think I want", type: "text", id: "functionWant" },
          {
            label: "What I know I don't want",
            type: "text",
            id: "functionNotWant",
          },
        ],
      },
    ],
  },
  {
    // Career Priorities Section
    title: "Career Priorities",
    questions: [
      {
        label: "Rate and Explain: Money",
        type: "rating",
        id: "money",
        explanationLabel: "Why is this important to you?",
      },
      {
        label: "Rate and Explain: Benefits",
        type: "rating",
        id: "benefits",
        explanationLabel: "Why is this important to you?",
      },
      {
        label: "Rate and Explain: Creative control",
        type: "rating",
        id: "creativeControl",
        explanationLabel: "Why is this important to you?",
      },
      {
        label: "Rate and Explain: Flexible work options",
        type: "rating",
        id: "flexibleWork",
        explanationLabel: "Why is this important to you?",
      },
      {
        label: "Rate and Explain: Proximity to home/school/daycare",
        type: "rating",
        id: "proximity",
        explanationLabel: "Why is this important to you?",
      },
      {
        label: "Rate and Explain: Challenge",
        type: "rating",
        id: "challenge",
        explanationLabel: "Why is this important to you?",
      },
      {
        label: "Rate and Explain: Social connections and camaraderie",
        type: "rating",
        id: "socialConnections",
        explanationLabel: "Why is this important to you?",
      },
      {
        label: "Rate and Explain: Measurable success",
        type: "rating",
        id: "measurableSuccess",
        explanationLabel: "Why is this important to you?",
      },
    ],
  },
];

function saveResponse(questionId, response) {
  // Save response using the questionId as the key
  userResponses[questionId] = response;

  // Update localStorage with the new state of userResponses
  localStorage.setItem("userResponses", JSON.stringify(userResponses));
}

function saveResponses() {
  const sectionQuestions = sections[currentSectionIndex].questions;
  if (currentQuestionIndex < sectionQuestions.length) {
    currentQuestionIndex++;
    showQuestion(currentQuestionIndex);
  } else if (currentSectionIndex < sections.length - 1) {
    currentSectionIndex++;
    currentQuestionIndex = 1;
    showQuestion(currentQuestionIndex);
  }
  updateSectionTabs();
  updateProgress();
}

document.getElementById("saveBtn").addEventListener("click", saveResponses);

// Add event listener to the Save button
document.getElementById("saveBtn").addEventListener("click", saveResponses);

function updateProgress() {
  // Calculate the overall progress based on the total number of questions.
  const totalQuestions = sections.reduce(
    (total, section) => total + section.questions.length,
    0
  );
  let questionsCompleted =
    sections
      .slice(0, currentSectionIndex)
      .reduce((total, section) => total + section.questions.length, 0) +
    currentQuestionIndex;
  const progressPercentage = (questionsCompleted / totalQuestions) * 100;

  // Update progress bar width
  document.getElementById(
    "progressBarInner"
  ).style.width = `${progressPercentage}%`;

  // Update progress counter text
  const progressCounter = document.getElementById("progressCounter");
  progressCounter.textContent = `${Math.round(progressPercentage)}%`;
}

function loadResponses() {
  const savedResponses = localStorage.getItem("userResponses");
  if (savedResponses) {
    userResponses = JSON.parse(savedResponses);
  }
}

function updateSectionTabs() {
  // Update the color of tabs based on their completion status.
  const tabIds = [
    "aboutYouTab",
    "coreValuesTab",
    "strengthTab",
    "skillsAssessmentTab",
    "dreamjobTab",
    "preferencesTab",
    "prioritiesTab",
  ]; // Add more as needed
  tabIds.forEach((id, index) => {
    if (index < currentSectionIndex) {
      document.getElementById(id).className =
        "bg-green-400 text-white text-center py-2 px-4 rounded";
    } else if (index === currentSectionIndex) {
      document.getElementById(id).className =
        "bg-yellow-400 text-white text-center py-2 px-4 rounded";
    } else {
      document.getElementById(id).className =
        "bg-white text-gray-800 text-center py-2 px-4 rounded shadow";
    }
  });
}

function addMoreRepeatableGroup(groupIndex) {
  const repeatableGroup = sections[currentSectionIndex].questions[groupIndex];
  if (repeatableGroup && repeatableGroup.type === "repeatableGroup") {
    // Increment counter for this group or initialize if not exist
    repeatableGroupCounter[groupIndex] =
      (repeatableGroupCounter[groupIndex] || 0) + 1;
    const newGroupIndex = `${groupIndex}_${repeatableGroupCounter[groupIndex]}`; // Create a unique index for the new group

    const questionsContainer = document.getElementById("questionsContainer");
    const groupDiv = document.createElement("div");
    groupDiv.setAttribute("id", `repeatableGroup-${newGroupIndex}`);
    groupDiv.className = "repeatable-group";

    repeatableGroup.questions.forEach((question, index) => {
      const uniqueId = `${repeatableGroup.baseId}-${newGroupIndex}-${index}`;
      const questionHTML = createSubQuestionHTML(question, uniqueId);
      groupDiv.appendChild(questionHTML);
    });

    const addMoreBtn = document.createElement("button");
    addMoreBtn.textContent = "Add More";
    addMoreBtn.className =
      "mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600";
    addMoreBtn.onclick = function () {
      addMoreRepeatableGroup(groupIndex);
    };
    groupDiv.appendChild(addMoreBtn);

    questionsContainer.appendChild(groupDiv);
  }
}

function displayProcessedResponses() {
  const processedDiv = document.getElementById("processedResponses");
  processedDiv.innerHTML = ""; // Clear previous content

  let content =
    '<h2 class="text-xl font-semibold mb-4">Processed Responses</h2>';

  sections.forEach((section) => {
    let sectionResponsesExist = false;
    let sectionContent = `<h3 class="text-lg font-semibold mt-4 mb-2">${section.title}</h3><ul>`;

    section.questions.forEach((question) => {
      const response = userResponses[question.id];
      if (response) {
        // Only add if there's a response
        sectionResponsesExist = true;
        sectionContent += `<li><strong>${question.label}:</strong> ${response}</li>`;
      }
    });

    sectionContent += "</ul>";

    // Only add the section content if there are responses in this section
    if (sectionResponsesExist) {
      content += sectionContent;
    }
  });

  processedDiv.innerHTML = content;
}

function createSubQuestionHTML(question, uniqueId) {
  const questionDiv = document.createElement("div");
  questionDiv.className = "question";

  const label = document.createElement("label");
  label.setAttribute("for", uniqueId);
  label.className = "block text-gray-700 text-sm font-bold mb-2";
  label.textContent = question.label;

  const input = document.createElement("input");
  input.type = "text";

  // In your createSubQuestionHTML function and similar
  input.id = `${sectionIndex}-${questionIndex}-${question.id}`; // Adjust if necessary to match your structure

  input.placeholder = question.label;
  input.className =
    "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";

  input.addEventListener("change", function () {
    saveResponse(uniqueId, input.value); // Adjust this if necessary to fit your response handling
  });

  questionDiv.appendChild(label);
  questionDiv.appendChild(input);

  return questionDiv;
}

function updateRatingBar(ratingBar, selectedRating) {
  const ratingItems = ratingBar.querySelectorAll(".rating-item");
  ratingItems.forEach((item, index) => {
    if (index < selectedRating) {
      item.classList.add("selected");
    } else {
      item.classList.remove("selected");
    }
  });
}

function createQuestionHTML(question, parentIndex = "") {
  if (question.type === "group") {
    const groupDiv = document.createElement("div");
    groupDiv.className = "question-group";

    question.questions.forEach((subQuestion) => {
      const subQuestionHTML = createQuestionHTML(
        subQuestion,
        `${parentIndex}-${subQuestion.id}`
      );
      groupDiv.appendChild(subQuestionHTML);
    });

    return groupDiv;
  } else if (question.type === "repeatableGroup") {
    const groupContainer = document.createElement("div");
    groupContainer.className = "question-group";
    const groupId = `repeatableGroup-${parentIndex}-${question.baseId}`;
    groupContainer.setAttribute("id", groupId);

    question.questions.forEach((subQuestion, index) => {
      const uniqueId = `${question.baseId}-${parentIndex}-${index}`;
      const questionDiv = createSubQuestionHTML(subQuestion, uniqueId);
      groupContainer.appendChild(questionDiv);
    });

    const addMoreBtn = document.createElement("button");
    addMoreBtn.textContent = "Add More";
    addMoreBtn.className =
      "mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600";
    addMoreBtn.onclick = function () {
      addMoreRepeatableGroup(parentIndex.split("-")[1]); // Extract group index from parentIndex
    };
    groupContainer.appendChild(addMoreBtn);

    return groupContainer;
  } else if (question.type === "radio") {
    const radioContainer = document.createElement("div");
    radioContainer.className = "radio-container mb-4 p-4";

    // Create and append the question label
    const questionLabel = document.createElement("h3");
    questionLabel.textContent = question.label;
    questionLabel.className = "text-lg font-semibold mb-2";
    radioContainer.appendChild(questionLabel);

    question.options.forEach((option) => {
      const optionContainer = document.createElement("div");
      optionContainer.className = "flex items-center mb-2";

      const input = document.createElement("input");
      input.type = "radio";
      input.id = `${question.id}-${option.value}`;
      input.name = question.id;
      input.value = option.value;
      input.className = "form-radio h-5 w-5 text-blue-600";

      // Add an event listener to save the response when a radio button is selected
      input.addEventListener("change", function () {
        saveResponse(question.id, this.value);
      });

      const label = document.createElement("label");
      label.setAttribute("for", input.id);
      label.textContent = option.label;
      label.className = "ml-2 text-gray-700";

      optionContainer.appendChild(input);
      optionContainer.appendChild(label);
      radioContainer.appendChild(optionContainer);
    });

    return radioContainer;
  } else if (question.type === "section") {
    const sectionContainer = document.createElement("div");
    sectionContainer.className = "section-container";

    const sectionTitle = document.createElement("h2");
    sectionTitle.textContent = question.title;
    sectionTitle.className = "section-title";
    sectionContainer.appendChild(sectionTitle);

    question.questions.forEach((subQuestion) => {
      const subQuestionHTML = createQuestionHTML(
        subQuestion,
        `${parentIndex}-${subQuestion.id}`
      );
      sectionContainer.appendChild(subQuestionHTML);
    });

    return sectionContainer;
  } else if (question.type === "rating") {
    const ratingContainer = document.createElement("div");
    ratingContainer.className =
      "rating-container flex flex-col items-center my-4";

    const label = document.createElement("label");
    label.textContent = question.label;
    label.className = "rating-label mb-2";
    ratingContainer.appendChild(label);

    const ratingValueDisplay = document.createElement("div");
    ratingValueDisplay.className = "rating-value text-lg mb-2";
    ratingValueDisplay.textContent = "Rating: 5"; // Default or previously saved rating

    const input = document.createElement("input");
    input.type = "range";
    input.id = question.id;
    input.name = question.id;
    input.min = "1";
    input.max = "8"; // As per your rating scale
    input.className = "rating-range";
    input.addEventListener("input", function () {
      ratingValueDisplay.textContent = `Rating: ${input.value}`; // Update display as the slider moves
      saveResponse(question.id, input.value); // Save the rating value
    });

    const explanationLabel = document.createElement("label");
    explanationLabel.textContent = question.explanationLabel;
    explanationLabel.className = "explanation-label mt-4";
    ratingContainer.appendChild(explanationLabel);

    const explanationInput = document.createElement("textarea");
    explanationInput.id = `${question.id}-explanation`;
    explanationInput.placeholder = question.explanationLabel;
    explanationInput.className =
      "explanation-input mt-2 w-full p-2 border rounded";
    explanationInput.addEventListener("input", () => {
      saveResponse(`${question.id}-explanation`, explanationInput.value); // Save the explanation
    });

    ratingContainer.appendChild(ratingValueDisplay);
    ratingContainer.appendChild(input);
    ratingContainer.appendChild(explanationInput);

    return ratingContainer;
  } else {
    // Standard question handling
    const questionDiv = document.createElement("div");
    questionDiv.className = "question";

    const label = document.createElement("label");
    label.setAttribute("for", question.id);
    label.className = "block text-gray-700 text-sm font-bold mb-2";
    label.textContent = question.label;

    const input = document.createElement("input");
    input.type = question.type;
    input.id = question.id;
    input.placeholder = question.label;
    input.className =
      "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";

    input.addEventListener("change", function () {
      saveResponse(question.id, input.value);
    });

    questionDiv.appendChild(label);
    questionDiv.appendChild(input);

    return questionDiv;
  }
}
function attachChangeEventToInputs() {
  document
    .querySelectorAll(
      'input[type="text"], input[type="number"], input[type="email"], textarea'
    )
    .forEach((input) => {
      input.addEventListener("change", function () {
        // Construct a unique questionId based on the input's ID
        const questionId = this.id;
        const response = this.value;
        saveResponse(questionId, response);
      });
    });
}

function displayResponses() {
  const questionsContainer = document.getElementById("questionsContainer");
  questionsContainer.innerHTML = ""; // Clear previous content

  sections.forEach((section, sectionIndex) => {
    section.questions.forEach((question, questionIndex) => {
      const questionId = question.id; // Assuming question IDs are unique across sections

      const response = userResponses[questionId] || "Not provided";

      const questionDiv = document.createElement("div");
      questionDiv.className = "mb-4 p-4 bg-gray-100 rounded";

      const questionLabel = document.createElement("h3");
      questionLabel.className = "text-lg font-semibold mb-2";
      questionLabel.textContent = question.label;
      questionDiv.appendChild(questionLabel);

      const responseText = document.createElement("p");
      responseText.textContent = `Answer: ${response}`;
      questionDiv.appendChild(responseText);

      questionsContainer.appendChild(questionDiv);
    });
  });
}

document.getElementById("saveBtn").addEventListener("click", saveResponses);
document
  .getElementById("displayBtn")
  .addEventListener("click", displayResponses);

document
  .getElementById("processBtn")
  .addEventListener("click", async function () {
    const userResponses = JSON.parse(
      localStorage.getItem("userResponses") || "{}"
    );
    // Send this data to the server
    await fetch("/save_responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userResponses),
    })
      .then((response) => response.json())
      .then((data) => {
        // Check if the responses were saved successfully
        if (data.message === "Responses saved successfully") {
          // Redirect if successful
          window.location.href = "/show_responses";
        } else {
          console.error("Failed to save responses");
        }
      })
      .catch((error) => console.error("Error:", error));
  });

loadResponses();
document.addEventListener("DOMContentLoaded", function () {
  attachChangeEventToInputs();
});

document
  .getElementById("generateLinkedInProfile")
  .addEventListener("click", function () {
    fetch("/generate-linkedin-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Display the generated LinkedIn content
        document.getElementById(
          "linkedinProfileContent"
        ).innerHTML = `<pre>${data.linkedinContent}</pre>`;
      })
      .catch((error) => console.error("Error:", error));
  });

function prepareDataForAnalysis() {
  const data = sections.reduce((acc, section) => {
    // Ensure each section is accounted for
    acc[section.title] = acc[section.title] || {};
    section.questions.forEach((question) => {
      const response = userResponses[question.id];
      if (response) {
        // Store responses in a manner that the backend expects
        acc[section.title][question.label] = response;
      }
    });
    return acc;
  }, {});

  return data;
}

function performAnalysis() {
  const data = prepareDataForAnalysis();
  // Assume you have an endpoint '/analyze' set up on your server
  fetch("/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      displayAnalysisResults(data.analysis);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

document
  .getElementById("generateResume")
  .addEventListener("click", function () {
    fetch("/generate-resume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Display the generated resume content
        document.getElementById(
          "resumeContent"
        ).innerHTML = `<pre>${data.resumeContent}</pre>`;
      })
      .catch((error) => console.error("Error:", error));
  });

function displayAnalysisResults(analysis) {
  const analysisDiv = document.getElementById("analysisSection");
  analysisDiv.innerHTML = `<pre>${analysis}</pre>`; // Display the analysis result
}

function displayFormattedAnalysis(analysisText) {
  // Split the analysis text into paragraphs
  const paragraphs = analysisText.split("\n\n");

  let formattedAnalysis = "";

  paragraphs.forEach((paragraph) => {
    // Check for list items within paragraphs
    const listItems = paragraph.match(/- (.*)/g);

    if (listItems) {
      // If list items exist, format them
      formattedAnalysis += "<ul>";
      listItems.forEach((item) => {
        // Bold text wrapped in **
        const formattedItem = item.replace(
          /\*\*(.*?)\*\*/g,
          "<strong>$1</strong>"
        );
        formattedAnalysis += `<li>${formattedItem}</li>`;
      });
      formattedAnalysis += "</ul>";
    } else {
      // Bold text wrapped in **
      const formattedParagraph = paragraph.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
      );
      formattedAnalysis += `<p>${formattedParagraph}</p>`;
    }
  });

  // Set the formatted analysis to the innerHTML of the analysis result section
  document.getElementById("analysisResult").innerHTML = formattedAnalysis;
}

// Replace the direct assignment in analyzeResponses with a call to this new function
async function analyzeResponses() {
  const dataForAnalysis = prepareDataForAnalysis();
  console.log("Data for analysis:", dataForAnalysis);

  // Assuming your backend is ready to receive and process this data
  const response = await fetch("/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataForAnalysis),
  });

  const analysisResult = await response.json();

  // Use the new function to display the analysis result
  displayFormattedAnalysis(analysisResult.analysis);
}

function prepareDataForAnalysis() {
  const data = {
    about_you: {},
    career_priorities: {},
    core_values: {},
    strengths: {},
    dream_job: {},
    preferences: {},
    skills_experience: {},
  };

  // Populate data object with user responses
  sections.forEach((section) => {
    section.questions.forEach((question) => {
      let key = section.title.toLowerCase().replace(/\s+/g, "_");
      if (!data[key]) {
        data[key] = {};
      }
      const response = userResponses[question.id];
      if (response) {
        data[key][question.label] = response;
      }
    });
  });

  return data;
}

function displayAnalysisResults(analysis) {
  const analysisDiv = document.getElementById("analysisSection");
  analysisDiv.innerHTML = `<pre>${analysis}</pre>`; // Display the analysis result
}

document
  .getElementById("analyzeBtn")
  .addEventListener("click", analyzeResponses);

function showQuestion(index) {
  const questionsContainer = document.getElementById("questionsContainer");
  questionsContainer.innerHTML = ""; // Clear previous content

  const section = sections[currentSectionIndex];
  if (section.questions[index - 1].type === "group") {
    // If the question is a group, render all its questions together
    const groupHTML = createQuestionHTML(section.questions[index - 1]);
    questionsContainer.appendChild(groupHTML);
  } else {
    // For non-grouped questions, proceed as normal
    const questionHTML = createQuestionHTML(section.questions[index - 1]);
    questionsContainer.appendChild(questionHTML);
  }

  updateProgress(); // Ensure progress is updated
}

document.getElementById("prevBtn").addEventListener("click", function () {
  // Adjusted to account for grouped questions as a single index
  if (currentQuestionIndex > 1) {
    currentQuestionIndex--;
    showQuestion(currentQuestionIndex);
  } else if (currentSectionIndex > 0) {
    // Navigate to previous section if applicable
    currentSectionIndex--;
    currentQuestionIndex = sections[currentSectionIndex].questions.length;
    showQuestion(currentQuestionIndex);
  }
  updateSectionTabs();
});

document.getElementById("nextBtn").addEventListener("click", function () {
  // Adjusted to account for grouped questions as a single index
  const sectionQuestions = sections[currentSectionIndex].questions;
  if (currentQuestionIndex < sectionQuestions.length) {
    currentQuestionIndex++;
    showQuestion(currentQuestionIndex);
  } else if (currentSectionIndex < sections.length - 1) {
    // Move to next section if available
    currentSectionIndex++;
    currentQuestionIndex = 1;
    showQuestion(currentQuestionIndex);
  }
  updateSectionTabs();
});

// Initial display and setup
showQuestion(currentQuestionIndex);
updateSectionTabs();
updateProgress();

console.log("Saving response for", questionId, response);
console.log("Displaying responses", userResponses);
