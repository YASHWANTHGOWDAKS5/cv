document.getElementById("cvForm").onsubmit = function (e) {
    e.preventDefault();

    // Gather input values
    const name = document.getElementById("name").value;
    const title = document.getElementById("title").value;
    const email = document.getElementById("email").value;
    const location = document.getElementById("location").value;
    const experience = document.getElementById("experience").value;
    const education = document.getElementById("education").value;
    const skills = document.getElementById("skills").value;
    const proudOf = document.getElementById("proudOf").value;

    // Profile Picture
    const profilePicture = document.getElementById("profilePicture").files[0];
    const profileImgElement = document.getElementById("cv-profile-picture");

    if (profilePicture) {
        const reader = new FileReader();
        reader.onload = function (e) {
            profileImgElement.src = e.target.result; // Display image in the preview
            profileImgElement.style.display = "block";
        };
        reader.readAsDataURL(profilePicture);
    } else {
        profileImgElement.style.display = "none";
    }

    // CGPA entries
    const cgpaContainer = document.getElementById("cgpa-container");
    const cvCgpa = document.getElementById("cv-cgpa");
    cvCgpa.innerHTML = ''; // Clear previous CGPA entries
    Array.from(cgpaContainer.querySelectorAll('.cgpa-entry')).forEach((cgpaEntry, index) => {
        const semester = `Semester ${index + 1}: ${cgpaEntry.value}`;
        const p = document.createElement('p');
        p.textContent = semester;
        cvCgpa.appendChild(p);
    });

    // My Time entries
    const myTimeSection = document.getElementById("my-time-section");
    const cvMyTime = document.getElementById("cv-my-time");
    cvMyTime.innerHTML = ''; // Clear previous My Time entries
    Array.from(myTimeSection.querySelectorAll('.time-activity')).forEach((activityInput, index) => {
        const hoursInput = myTimeSection.querySelectorAll('.time-hours')[index];
        const activity = `${activityInput.value}: ${hoursInput.value} hours`;
        const li = document.createElement('li');
        li.textContent = activity;
        cvMyTime.appendChild(li);
    });

    // Add heading to the preview (centered "Resume OF:")
    const heading = document.createElement("h1");
    heading.textContent = "Resume OF:";
    heading.style.textAlign = "center";
    heading.style.marginBottom = "20px"; // Adds space between heading and other content
    heading.style.fontSize = "1.8em"; // Ensures it looks like an H1 in PDF
    document.getElementById("cvPreview").prepend(heading);

    // Populate the rest of the preview
    document.getElementById("cv-name").textContent = name;
    document.getElementById("cv-title").textContent = title;
    document.getElementById("cv-email").textContent = email;
    document.getElementById("cv-location").textContent = location;
    document.getElementById("cv-experience").textContent = experience;
    document.getElementById("cv-education").textContent = education;
    document.getElementById("cv-skills").textContent = skills;
    document.getElementById("cv-proudOf").textContent = proudOf;

    document.getElementById("cvPreview").style.display = "block";

    // Wait a short time to ensure the profile picture is loaded before generating the PDF
    setTimeout(() => {
        // Generate and download the PDF
        const element = document.getElementById("cvPreview");
        html2pdf()
            .from(element)
            .set({
                margin: [0.5, 0.5, 0.5, 0.5],
                filename: `${name}_CV.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, logging: true, useCORS: true }, // Enable CORS for images
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            })
            .save()
            .then(() => {
                alert("PDF generated successfully!");
            })
            .catch((error) => {
                console.error("Error generating PDF:", error);
                alert("Failed to generate PDF. Please try again.");
            });
    }, 500); // 500ms delay to allow image loading
};

// Add new CGPA input field
document.getElementById("add-cgpa").addEventListener("click", function () {
    const input = document.createElement("input");
    input.type = "number";
    input.placeholder = "Semester CGPA";
    input.classList.add("cgpa-entry");
    input.step = "0.01";
    input.min = "0";
    input.max = "10";
    document.getElementById("cgpa-container").appendChild(input);
});

// Add new My Time activity
document.getElementById("add-time").addEventListener("click", function () {
    const activityDiv = document.createElement("div");
    activityDiv.classList.add("my-time-entry");

    const activityInput = document.createElement("input");
    activityInput.type = "text";
    activityInput.placeholder = "Activity";
    activityInput.classList.add("time-activity");

    const hoursInput = document.createElement("input");
    hoursInput.type = "number";
    hoursInput.placeholder = "Hours";
    hoursInput.classList.add("time-hours");
    hoursInput.min = "1";
    hoursInput.max = "168";

    activityDiv.appendChild(activityInput);
    activityDiv.appendChild(hoursInput);

    document.getElementById("my-time-section").appendChild(activityDiv);
});
