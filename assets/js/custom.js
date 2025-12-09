// -----------------------------
// REAL-TIME VALIDACIJA FUNKCIJOS
// -----------------------------

function isText(value) {
    return /^[A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž\s-]+$/.test(value);
}

function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function formatPhone(value) {
    // Palikti tik skaičius
    let cleaned = value.replace(/\D/g, "");

    // 86 → 3706
    if (cleaned.startsWith("86")) {
        cleaned = "3706" + cleaned.substring(2);
    }

    // 6 → 3706
    if (cleaned.startsWith("6")) {
        cleaned = "370" + cleaned;
    }

    // +3706xxxxxxx (be tarpų!)
    if (cleaned.length > 0) {
        return "+370" + cleaned.substring(3); 
    }

    return "+370";
}


// Patikrina ar tel. numeris teisingas
function isValidPhone(value) {
    return /^\+3706\d{7}$/.test(value);

}

// Patikrina ar laukas neužpildytas
function isEmpty(value) {
    return value.trim() === "";
}


// -----------------------------
// VALIDACIJA REALIU LAIKU
// -----------------------------

const vardas = document.getElementById("vardas");
const pavarde = document.getElementById("pavarde");
const email = document.getElementById("email");
const telefonas = document.getElementById("telefonas");
const adresas = document.getElementById("adresas");

const submitBtn = document.getElementById("submitBtn");

function validateAll() {
    let valid = true;

    // Vardas
    if (!isText(vardas.value)) {
        document.getElementById("err-vardas").classList.remove("d-none");
        vardas.classList.add("is-invalid");
        valid = false;
    } else {
        document.getElementById("err-vardas").classList.add("d-none");
        vardas.classList.remove("is-invalid");
    }

    // Pavardė
    if (!isText(pavarde.value)) {
        document.getElementById("err-pavarde").classList.remove("d-none");
        pavarde.classList.add("is-invalid");
        valid = false;
    } else {
        document.getElementById("err-pavarde").classList.add("d-none");
        pavarde.classList.remove("is-invalid");
    }

    // Email
    if (!isEmail(email.value)) {
        document.getElementById("err-email").classList.remove("d-none");
        email.classList.add("is-invalid");
        valid = false;
    } else {
        document.getElementById("err-email").classList.add("d-none");
        email.classList.remove("is-invalid");
    }

    // Telefonas
    if (!isValidPhone(telefonas.value)) {
        document.getElementById("err-telefonas").classList.remove("d-none");
        telefonas.classList.add("is-invalid");
        valid = false;
    } else {
        document.getElementById("err-telefonas").classList.add("d-none");
        telefonas.classList.remove("is-invalid");
    }

    // Adresas
    if (isEmpty(adresas.value)) {
        document.getElementById("err-adresas").classList.remove("d-none");
        adresas.classList.add("is-invalid");
        valid = false;
    } else {
        document.getElementById("err-adresas").classList.add("d-none");
        adresas.classList.remove("is-invalid");
    }

    // Aktyvuojam / išjungiame Submit mygtuką
    submitBtn.disabled = !valid;
}

// Laukai tikrinami realiu laiku
vardas.addEventListener("input", validateAll);
pavarde.addEventListener("input", validateAll);
email.addEventListener("input", validateAll);
adresas.addEventListener("input", validateAll);

telefonas.addEventListener("input", function () {
    this.value = formatPhone(this.value);
    validateAll();
});


// -----------------------------
// SLIDER VALUE REAL-TIME
// -----------------------------
document.getElementById("q1").addEventListener("input", () => {
    q1Value.innerText = q1.value;
});
document.getElementById("q2").addEventListener("input", () => {
    q2Value.innerText = q2.value;
});
document.getElementById("q3").addEventListener("input", () => {
    q3Value.innerText = q3.value;
});


// -----------------------------
// FORMOS SUBMIT
// -----------------------------
document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Jei vis dar kažkas neteisinga
    validateAll();
    if (submitBtn.disabled) return;

    let data = {
        vardas: vardas.value,
        pavarde: pavarde.value,
        email: email.value,
        telefonas: telefonas.value,
        adresas: adresas.value,
        q1: Number(q1.value),
        q2: Number(q2.value),
        q3: Number(q3.value),
    };

    console.log("Gauti duomenys:", data);

    // Vidurkis
    let avg = ((data.q1 + data.q2 + data.q3) / 3).toFixed(1);

    // Atvaizdavimas puslapyje
    const box = document.getElementById("resultsBox");
    box.style.display = "block";
    box.innerHTML = `
        <p><strong>Vardas:</strong> ${data.vardas}</p>
        <p><strong>Pavardė:</strong> ${data.pavarde}</p>
        <p><strong>El. paštas:</strong> ${data.email}</p>
        <p><strong>Tel. numeris:</strong> ${data.telefonas}</p>
        <p><strong>Vidurkis:</strong> ${avg}</p>
    `;

    // -----------------------------
    // POP-UP PRANEŠIMAS
    // -----------------------------
    alert("Duomenys pateikti sėkmingai!");
});
