document.addEventListener("DOMContentLoaded", () => {
  fetch("guide.json")
    .then((response) => response.json())
    .then((data) => {
      renderGuide(data);
      renderMap(data);
    });
});

function renderGuide(guideData) {
  const container = document.getElementById("guide-container");

  guideData.forEach((entry, index) => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-2xl shadow-md p-4 mb-6";

    const title = document.createElement("h2");
    title.className = "text-lg font-semibold text-blue-800 mb-2";
    title.textContent = index === 0
      ? entry.title
      : `Station ${index}: ${entry.title}`; // index == 0 = Einleitung

    const image = document.createElement("img");
    image.src = entry.image;
    image.alt = entry.title;
    image.className = "mb-2 rounded w-[500px] h-[500px] object-cover mx-auto";

    const audio = document.createElement("audio");
    audio.controls = true;
    audio.className = "w-full";
    const source = document.createElement("source");
    source.src = entry.audio;
    source.type = "audio/mpeg";
    audio.appendChild(source);

    card.appendChild(title);
    card.appendChild(image);
    card.appendChild(audio);

    container.appendChild(card);
  });
}

function renderMap(guideData) {
  const map = L.map("map");

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap-Mitwirkende',
  }).addTo(map);

  const bounds = L.latLngBounds([]);

  guideData.forEach((entry, index) => {
    if (!entry.coords) return;

    bounds.extend(entry.coords);

    const marker = L.marker(entry.coords, {
      icon: L.divIcon({
        className: "custom-div-icon",
        html: `<div style="background-color:#427898;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:bold;">${index}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      }),
    }).addTo(map);

    const popupTitle = index === 0
      ? entry.title
      : `Station ${index}<br>${entry.title}`;

    marker.bindPopup(`<strong>${popupTitle}</strong>`);
  });

  map.fitBounds(bounds, { padding: [30, 30] });
}
