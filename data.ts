
import { Investigation, Facility } from './types';

export const investigations: Investigation[] = [
  {
    id: "fa",
    title: "Al-Ahli Hospital Explosion – Acoustic & Spatial Reconstruction",
    outlet: "Forensic Architecture + Earshot",
    actorType: "OSINT / research agency",
    mission: ["Human rights & accountability", "Open-source intelligence"],
    stance: ["Challenges IDF narrative", "Israeli munition"],
    stanceShort: "Attributes blast to Israeli artillery shell, not a misfired rocket.",
    publicationDate: "2024-02-26",
    country: "UK",
    methodology: ["Video geolocation", "3D modelling / simulation", "Audio / acoustic analysis", "Trajectory reconstruction"],
    dataInputs: ["Social media videos", "TV footage", "Open satellite imagery", "User-generated audio"],
    keyFindings: "Reconstructs projectile trajectory and timing using synchronized videos and audio; concludes the blast was consistent with an Israeli artillery shell fired from the east, not a misfired Palestinian rocket.",
    links: [
      { label: "FA case page", url: "https://forensic-architecture.org/investigation/al-ahli-al-maamadani-hospital" },
      { label: "FA: Israeli Disinformation", url: "https://forensic-architecture.org/investigation/israeli-disinformation-al-ahli-hospital" },
      { label: "When It Stopped Being a War", url: "https://forensic-architecture.org/investigation/when-it-stopped-being-a-war" },
      { label: "Channel 4 collaboration (UK)", url: "https://www.channel4.com/news/who-was-behind-the-gaza-hospital-blast-visual-investigation" }
    ],
    media: [
      { kind: "image", label: "FA case graphic – trajectory & impact", url: "https://content.forensic-architecture.org/wp-content/uploads/2024/02/Image-1-Rocket-Propellant-Analysis-2400x1350.jpg" },
      { kind: "image", label: "FA x Channel 4 report", url: "https://fa-public-assets.fra1.cdn.digitaloceanspaces.com/IsraeliDisinformation/GIF%204%20-%20Methodology%20-%20Panorama%20Paint.gif" },
      { kind: "image", label: "FA: Analysis Workflow", url: "https://fa-public-assets.fra1.cdn.digitaloceanspaces.com/IsraeliDisinformation/GIF%205%20-%20Methodology%20-%20Analysis.gif" }
    ],
    primaryEpistemicObject: "Trajectory & temporal synchronization",
    outcomeForm: "Forensic model-based reconstruction",
    location: { lat: 31.5049, lng: 34.4514, label: "Hospital Courtyard" },
    vector: { origin: [31.5040, 34.4850], angle: 270, magnitude: 0.003 }
  },
  {
    id: "hrw",
    title: "Gaza: Findings on the October 17 Al-Ahli Hospital Explosion",
    outlet: "Human Rights Watch",
    actorType: "NGO / human rights",
    mission: ["Human rights & accountability"],
    stance: ["Palestinian rocket", "Challenges IDF narrative", "Inconclusive / uncertain"],
    stanceShort: "Says evidence points to a misfired Palestinian rocket, but calls for independent investigation.",
    publicationDate: "2023-11-26",
    country: "International",
    methodology: ["Satellite imagery", "Video geolocation", "Crater / damage analysis", "Open-source media review"],
    dataInputs: ["Videos of the blast", "Satellite imagery of impact site", "Witness statements in media"],
    keyFindings: "Assesses crater size, direction of fragmentation, and video timing to argue the explosion is most consistent with a locally launched rocket, while stressing major evidentiary gaps.",
    links: [{ label: "HRW report", url: "https://www.hrw.org/news/2023/11/26/gaza-findings-october-17-al-ahli-hospital-explosion" }],
    media: [{ kind: "image", label: "Al-Ahli grounds aerial with crater", url: "https://www.hrw.org/sites/default/files/styles/modal/public/media_2023/11/202311mena_gaza_hospital_crater.jpg" }],
    primaryEpistemicObject: "Crater morphology & material damage",
    outcomeForm: "NGO technical report",
    location: { lat: 31.50495, lng: 34.45142, label: "Parking Lot" }
  },
  {
    id: "nyt",
    title: "A Close Look at Key Evidence in the Gaza Hospital Blast",
    outlet: "The New York Times Visual Investigations",
    actorType: "Newsroom / media",
    mission: ["Independent journalism"],
    stance: ["Palestinian rocket", "Supports IDF narrative", "Inconclusive / uncertain"],
    stanceShort: "Leans toward a misfired Palestinian rocket scenario while acknowledging unresolved uncertainties.",
    publicationDate: "2023-10-25",
    country: "US",
    methodology: ["Satellite imagery", "Video geolocation", "Blast / damage comparison"],
    dataInputs: ["Televised launch site videos", "Social media clips of blast", "Commercial satellite imagery"],
    keyFindings: "Compares crater, fire pattern, and launch footage, concluding the evidence is more consistent with a misfired rocket from Gaza than with an Israeli airstrike.",
    links: [{ label: "NYT visual investigation", url: "https://www.nytimes.com/2023/10/24/world/middleeast/gaza-hospital-israel-hamas-video.html" }],
    media: [{ kind: "image", label: "NYT explainer video Still", url: "https://static01.nyt.com/images/2023/11/03/multimedia/03themorning-hospital1-jfbv/03themorning-hospital1-jfbv-superJumbo.jpg?quality=75&auto=webp" }],
    primaryEpistemicObject: "Visual timeline alignment & ballistic review",
    outcomeForm: "Interactive visual narrative",
    location: { lat: 31.5050, lng: 34.4515, label: "Impact Site" }
  },
  {
    id: "wapo",
    title: "Analysis of Video Evidence from the Al-Ahli Hospital Blast",
    outlet: "The Washington Post Visual Forensics",
    actorType: "Newsroom / media",
    mission: ["Independent journalism"],
    stance: ["Inconclusive / uncertain", "Challenges IDF narrative"],
    stanceShort: "Argues the projectile seen in key videos was likely an Israeli interceptor, not the munition that hit the hospital.",
    publicationDate: "2023-10-26",
    country: "US",
    methodology: ["Video geolocation", "Trajectory / timing analysis", "Comparison with prior intercept footage"],
    dataInputs: ["Livestream videos from Gaza", "Footage broadcast by Al Jazeera"],
    keyFindings: "Reanalyzes the video used by the IDF and concludes the object seen exploding in mid-air was too far away to be the munition that struck the hospital.",
    links: [{ label: "Washington Post analysis", url: "https://www.washingtonpost.com/investigations/2023/10/26/gaza-hospital-blast-evidence-israel-hamas/" }],
    media: [{ kind: "image", label: "Trajectory visuals from WaPo", url: "https://gfx-data.news-engineering.aws.wapo.pub/ai2html/overheadview/APVFAR36QJFCPMGIALWA62RQPI/POV_MAP_AJ-xlarge.jpg?v=2" }],
    primaryEpistemicObject: "Video trace re-analysis",
    outcomeForm: "Investigative feature",
    location: { lat: 31.5052, lng: 34.4510, label: "WaPo Analysis Area" }
  },
  {
    id: "bbc",
    title: "Gaza Hospital Blast: What New Analysis Tells Us",
    outlet: "BBC Verify",
    actorType: "Newsroom / media",
    mission: ["Independent journalism"],
    stance: ["Palestinian rocket", "Inconclusive / uncertain"],
    stanceShort: "Considers a misfired rocket more likely but avoids a definitive attribution.",
    publicationDate: "2023-10-26",
    country: "UK",
    methodology: ["Video geolocation", "Sound / timing comparison", "Damage-site inspection via imagery"],
    dataInputs: ["Multiple UGC videos", "Agency photos of car park damage"],
    keyFindings: "Aligns timing of different camera angles and auditory cues to situate the likely launch area and impact timing.",
    links: [{ label: "BBC Verify article", url: "https://www.bbc.com/news/world-middle-east-67144061" }],
    media: [{ kind: "image", label: "BBC Verify composite still", url: "https://ichef.bbci.co.uk/news/1536/cpsprodpb/12ABC/production/_131467467_crater12-nc.png.webp" }],
    primaryEpistemicObject: "Multi-modal verification suite",
    outcomeForm: "Verification summary",
    location: { lat: 31.5049, lng: 34.4514, label: "BBC Analysis Site" }
  },
  {
    id: "idf",
    title: "Official Operational Briefing on Al-Ahli Hospital Blast",
    outlet: "Israel Defense Forces (IDF)",
    actorType: "State actor / intelligence",
    mission: ["State security / military"],
    stance: ["Palestinian rocket", "Supports IDF narrative"],
    stanceShort: "States the explosion was caused by a misfired rocket launched by Palestinian militants.",
    publicationDate: "2023-10-18",
    country: "Israel",
    methodology: ["Classified intelligence", "Radar / launch detection", "Intercepted communications"],
    dataInputs: ["Military sensor data", "Alleged audio intercept"],
    keyFindings: "Claims radar data and an intercepted phone call prove that a Palestinian rocket misfired and fell in the hospital car park.",
    links: [{ label: "IDF report", url: "https://www.idf.il/en/mini-sites/israel-at-war/all-articles/al-ahli-al-maamadani-hospital-initial-idf-aftermath-report-october-18-2023/#incident" }],
    media: [{ kind: "image", label: "IDF Before/After Imagery", url: "https://www.idf.il/media/okpnsic3/before-and-after.jpeg" }],
    primaryEpistemicObject: "Military intelligence construct",
    outcomeForm: "Operational briefing",
    location: { lat: 31.5055, lng: 34.4518, label: "IDF Plot" }
  },
  {
    id: "bellingcat",
    title: "Identifying a Possible Crater from Gaza Hospital Blast",
    outlet: "Bellingcat",
    actorType: "Collective / community OSINT",
    mission: ["Open-source intelligence", "Independent journalism"],
    stance: ["Inconclusive / uncertain"],
    stanceShort: "Analyses imagery to identify a likely crater and constrain munition possibilities.",
    publicationDate: "2023-10-18",
    country: "Networked / transnational",
    methodology: ["Satellite imagery", "Video geolocation", "Shadow analysis / timing"],
    dataInputs: ["Open satellite imagery", "Photos of parking lot damage", "News & social media videos"],
    keyFindings: "Geolocates and analyzes a small crater in the car park, comparing it to known impact signatures of rockets and other munitions.",
    links: [{ label: "Bellingcat report", url: "https://www.bellingcat.com/news/2023/10/18/identifying-possible-crater-from-gaza-hospital-blast/" }],
    media: [{ kind: "image", label: "Bellingcat annotated crater", url: "https://www.bellingcat.com/app/uploads/2023/10/unnamed-2.png" }],
    primaryEpistemicObject: "Trace correlation & site constraining",
    outcomeForm: "Open-source collective analysis",
    location: { lat: 31.50495, lng: 34.45145, label: "Crater Location" }
  }
];

export const healthSectorFacilities: Facility[] = [
  { 
    id: "h1", name: "Al-Ahli Al-Ma'amadani Hospital", type: "Hospital", status: "Partially Functioning",
    location: { lat: 31.5049, lng: 34.4514 },
    boundary: [
      [31.5052, 34.4510], [31.5052, 34.4518], [31.5046, 34.4518], [31.5046, 34.4510]
    ],
    incidents: [
      { date: "2023-10-14", type: "Shelling", description: "Forensic Architecture reports upper floor ultrasound room hit by artillery shells.", source: "Forensic Architecture" },
      { date: "2023-10-17", type: "Direct Attack", description: "Mass casualty explosion in the central courtyard.", source: "Multiple" }
    ]
  },
  { 
    id: "h2", name: "Al-Shifa Hospital", type: "Hospital", status: "Out of Service",
    location: { lat: 31.5244, lng: 34.4447 },
    boundary: [
      [31.5255, 34.4435], [31.5255, 34.4465], [31.5235, 34.4465], [31.5235, 34.4435]
    ],
    incidents: [
      { date: "2023-11-03", type: "Airstrike", description: "Ambulance convoy outside main gate targeted.", source: "Al Jazeera" },
      { date: "2023-11-15", type: "Siege", description: "Ground forces enter the complex.", source: "IDF" },
      { date: "2024-03-18", type: "Direct Attack", description: "Total destruction following 2-week operation.", source: "WHO" }
    ]
  },
  { 
    id: "h3", name: "Al-Quds Hospital", type: "Hospital", status: "Out of Service",
    location: { lat: 31.5022, lng: 34.4344 },
    boundary: [
      [31.5030, 34.4335], [31.5030, 34.4355], [31.5015, 34.4355], [31.5015, 34.4335]
    ],
    incidents: [
      { date: "2023-11-11", type: "Siege", description: "Surrounded by tanks, evacuations ordered.", source: "PRCS" }
    ]
  },
  {
    id: "h4", name: "Indonesian Hospital", type: "Hospital", status: "Out of Service",
    location: { lat: 31.5358, lng: 34.5097 },
    incidents: [
      { date: "2023-11-20", type: "Direct Attack", description: "Artillery strikes on top floors.", source: "Ministry of Health" }
    ]
  }
];
