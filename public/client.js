document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("myForm").addEventListener("submit", submitForm);
});

async function submitForm() {
  // LOADING
  document.getElementById("result").textContent = "Loading...";

  const nickName = document.getElementById("nickName").value;
  const Role = document.getElementById("Role").value;
  const genre = document.getElementById("genre").value;

  const response = await fetch("/submit", {
    method: "POST",
    // we are doing a post request
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nickName, Role, genre }),
  });

  const resultContainer = document.getElementById("result");
  resultContainer.textContent = "";

  if (response.ok) {
    // *** getting the data from index.js to here!
    const jsonData = await response.json();
    // console.log(jsonData);

    const message = jsonData.message;
    const additionalInfo = jsonData.setting;
    const gptResponse = jsonData.gpt;

    // *** updating the textContent in your html!
    document.getElementById("result").innerHTML = message;
    document.getElementById("charSetting").innerHTML = additionalInfo;
    document.getElementById("gpt").innerHTML = gptResponse;

    console.log("--HTML updated");
  } else {
    resultContainer.textContent = "Error in submitting data.";
  }
}
