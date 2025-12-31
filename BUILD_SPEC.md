# PFT/CFT Proctor App - Build Specification

## Overview

**Repo Name:** `pft-cft-proctor`
**Purpose:** Mobile-first PFT/CFT/HTWT calculator and proctor worksheet. Proctors fill in scores on their phone during the event, auto-calculates class, generates printable/emailable PDF.
**Target Users:** PFT/CFT monitors, FFIs, CPTRs, individual Marines checking scores

---

## Design System

**CRITICAL:** Use the shared design system from `DESIGN_SYSTEM.md`. All colors, typography, spacing, and components must match exactly for suite consistency.

---

## References

- MCO 6100.13A w/CH-4 (PFT/CFT Order) - March 23, 2022
- MCO 6110.3A w/CH-4 (Body Composition Program)
- NAVMC 11622 (PFT/CFT Performance Worksheet)

---

## Features Required

### 1. PFT Calculator
- Pull-ups OR Push-ups selection
- Plank hold (crunches deprecated as of Jan 1, 2023)
- 3-mile run OR 5k row (row available for 46+ or medical waiver)
- Age-adjusted scoring by gender
- Altitude adjustment for run/row (toggle for 4,500ft+)

### 2. CFT Calculator
- Movement to Contact (MTC) - 880yd run
- Ammunition Lift (AL) - 30lb ammo can lifts in 2 min
- Maneuver Under Fire (MANUF) - 300yd shuttle
- Age-adjusted scoring by gender
- Altitude adjustment for MTC and MANUF

### 3. HTWT/BCP Calculator
- Height/weight screening
- Body fat calculation if over weight standard
- Tape measurement calculator:
  - Males: Abdomen - Neck = Circumference Value
  - Females: Abdomen + Hips - Neck = Circumference Value
- Body fat percentage lookup table

### 4. Proctor Worksheet Mode
- Enter Marine info (Name, Rank, EDIPI, DOB, Gender)
- Enter raw scores for each event
- Auto-calculate points and total
- Track multiple Marines in a session
- Generate PDF matching NAVMC 11622 format

### 5. Additional Features
- Night mode (red on black for field use)
- Offline capable (PWA)
- Save drafts locally
- Email PDF to self
- Print-friendly output

---

## Scoring Data

### PFT Classification Scores
| Class | Points | FITREP Grade |
|-------|--------|--------------|
| 1st Class | 235-300 | A |
| 2nd Class | 200-234 | B |
| 3rd Class | 150-199 | C |
| Fail | Below 150 | Fail |

- Minimum 40 points per event required
- Total minimum 150 to pass
- Push-ups cap at 70 points max (pull-ups can get 100)

### CFT Classification Scores
| Class | Points | FITREP Grade |
|-------|--------|--------------|
| 1st Class | 235-300 | A |
| 2nd Class | 200-234 | B |
| 3rd Class | 150-199 | C |
| Fail | Below 150 | Fail |

---

## PFT Scoring Tables

### Pull-ups (Max 100 points)

**Male:**
| Age | Max Reps (100 pts) | Min Reps (40 pts) |
|-----|-------------------|-------------------|
| 17-20 | 23 | 4 |
| 21-25 | 23 | 5 |
| 26-30 | 23 | 5 |
| 31-35 | 23 | 5 |
| 36-40 | 23 | 5 |
| 41-45 | 23 | 5 |
| 46-50 | 23 | 4 |
| 51+ | 23 | 3 |

**Female:**
| Age | Max Reps (100 pts) | Min Reps (40 pts) |
|-----|-------------------|-------------------|
| 17-20 | 12 | 1 |
| 21-25 | 12 | 1 |
| 26-30 | 12 | 2 |
| 31-35 | 12 | 2 |
| 36-40 | 12 | 2 |
| 41-45 | 12 | 1 |
| 46-50 | 12 | 1 |
| 51+ | 12 | 1 |

### Push-ups (Max 70 points, 2 minutes)

**Male:**
| Age | Max Reps (70 pts) | Min Reps (40 pts) |
|-----|-------------------|-------------------|
| 17-20 | 82 | 42 |
| 21-25 | 87 | 47 |
| 26-30 | 84 | 44 |
| 31-35 | 80 | 40 |
| 36-40 | 76 | 36 |
| 41-45 | 72 | 32 |
| 46-50 | 68 | 28 |
| 51+ | 64 | 24 |

**Female:**
| Age | Max Reps (70 pts) | Min Reps (40 pts) |
|-----|-------------------|-------------------|
| 17-20 | 42 | 19 |
| 21-25 | 48 | 25 |
| 26-30 | 50 | 27 |
| 31-35 | 46 | 23 |
| 36-40 | 42 | 19 |
| 41-45 | 38 | 15 |
| 46-50 | 34 | 11 |
| 51+ | 30 | 7 |

### Plank (Same for all ages/genders)
| Time | Points |
|------|--------|
| 3:45 | 100 |
| 3:30 | 95 |
| 3:15 | 90 |
| 3:00 | 85 |
| 2:45 | 80 |
| 2:30 | 75 |
| 2:15 | 70 |
| 2:00 | 65 |
| 1:45 | 60 |
| 1:30 | 55 |
| 1:20 | 50 |
| 1:15 | 45 |
| 1:10 | 40 |
| Below 1:10 | 0 (Fail) |

**Note:** Interpolate for times between these values. Score decreases linearly.

### 3-Mile Run

**Male (Under 4,500ft altitude):**
| Age | Max Time (100 pts) | Min Time (40 pts) |
|-----|-------------------|-------------------|
| 17-20 | 18:00 | 27:40 |
| 21-25 | 18:00 | 27:40 |
| 26-30 | 18:00 | 28:00 |
| 31-35 | 18:00 | 28:20 |
| 36-40 | 18:00 | 28:40 |
| 41-45 | 18:30 | 29:20 |
| 46-50 | 19:00 | 30:00 |
| 51+ | 19:30 | 33:00 |

**Female (Under 4,500ft altitude):**
| Age | Max Time (100 pts) | Min Time (40 pts) |
|-----|-------------------|-------------------|
| 17-20 | 21:00 | 30:50 |
| 21-25 | 21:00 | 30:50 |
| 26-30 | 21:30 | 31:20 |
| 31-35 | 22:00 | 32:00 |
| 36-40 | 22:30 | 32:30 |
| 41-45 | 23:00 | 33:00 |
| 46-50 | 23:30 | 34:00 |
| 51+ | 24:00 | 36:00 |

**Altitude Adjustment (4,500ft+):** Add 30 seconds to max time, add 1 minute to min time for each bracket.

### 5k Row (Available for 46+ or medical waiver)

**Male:**
| Age | Max Time (100 pts) | Min Time (40 pts) |
|-----|-------------------|-------------------|
| 46-50 | 20:00 | 28:00 |
| 51+ | 21:00 | 30:00 |

**Female:**
| Age | Max Time (100 pts) | Min Time (40 pts) |
|-----|-------------------|-------------------|
| 46-50 | 23:00 | 31:00 |
| 51+ | 24:00 | 33:00 |

---

## CFT Scoring Tables

### Movement to Contact (880 yards)

**Male:**
| Age | Max Time (100 pts) | Min Time (40 pts) |
|-----|-------------------|-------------------|
| 17-20 | 2:38 | 4:13 |
| 21-25 | 2:38 | 4:13 |
| 26-30 | 2:39 | 4:21 |
| 31-35 | 2:42 | 4:33 |
| 36-40 | 2:48 | 4:51 |
| 41-45 | 2:54 | 5:03 |
| 46-50 | 3:00 | 5:18 |
| 51+ | 3:12 | 5:41 |

**Female:**
| Age | Max Time (100 pts) | Min Time (40 pts) |
|-----|-------------------|-------------------|
| 17-20 | 3:08 | 5:07 |
| 21-25 | 3:10 | 5:11 |
| 26-30 | 3:15 | 5:21 |
| 31-35 | 3:23 | 5:37 |
| 36-40 | 3:32 | 5:56 |
| 41-45 | 3:42 | 6:14 |
| 46-50 | 3:50 | 6:30 |
| 51+ | 4:02 | 6:53 |

### Ammunition Lift (30lb ammo can, 2 minutes)

**Male:**
| Age | Max Reps (100 pts) | Min Reps (40 pts) |
|-----|-------------------|-------------------|
| 17-20 | 106 | 45 |
| 21-25 | 106 | 45 |
| 26-30 | 103 | 45 |
| 31-35 | 99 | 41 |
| 36-40 | 93 | 38 |
| 41-45 | 88 | 34 |
| 46-50 | 80 | 30 |
| 51+ | 72 | 25 |

**Female:**
| Age | Max Reps (100 pts) | Min Reps (40 pts) |
|-----|-------------------|-------------------|
| 17-20 | 66 | 25 |
| 21-25 | 66 | 25 |
| 26-30 | 65 | 25 |
| 31-35 | 63 | 23 |
| 36-40 | 60 | 22 |
| 41-45 | 57 | 19 |
| 46-50 | 52 | 16 |
| 51+ | 46 | 12 |

### Maneuver Under Fire (300 yards with tasks)

**Male:**
| Age | Max Time (100 pts) | Min Time (40 pts) |
|-----|-------------------|-------------------|
| 17-20 | 2:14 | 4:05 |
| 21-25 | 2:14 | 4:05 |
| 26-30 | 2:16 | 4:14 |
| 31-35 | 2:21 | 4:29 |
| 36-40 | 2:28 | 4:49 |
| 41-45 | 2:36 | 5:03 |
| 46-50 | 2:44 | 5:23 |
| 51+ | 2:56 | 5:50 |

**Female:**
| Age | Max Time (100 pts) | Min Time (40 pts) |
|-----|-------------------|-------------------|
| 17-20 | 3:01 | 5:30 |
| 21-25 | 3:02 | 5:33 |
| 26-30 | 3:08 | 5:47 |
| 31-35 | 3:18 | 6:09 |
| 36-40 | 3:30 | 6:36 |
| 41-45 | 3:42 | 7:00 |
| 46-50 | 3:55 | 7:26 |
| 51+ | 4:13 | 8:00 |

---

## Height/Weight Standards (DoD)

### Male Maximum Weight (lbs)
| Height | 17-20 | 21-27 | 28-39 | 40+ |
|--------|-------|-------|-------|-----|
| 58" | 131 | 136 | 139 | 141 |
| 59" | 136 | 141 | 144 | 146 |
| 60" | 141 | 146 | 149 | 151 |
| 61" | 146 | 151 | 154 | 156 |
| 62" | 150 | 156 | 159 | 161 |
| 63" | 155 | 161 | 164 | 166 |
| 64" | 160 | 166 | 169 | 172 |
| 65" | 165 | 171 | 175 | 177 |
| 66" | 170 | 176 | 180 | 183 |
| 67" | 175 | 181 | 185 | 188 |
| 68" | 181 | 187 | 191 | 194 |
| 69" | 186 | 193 | 197 | 200 |
| 70" | 191 | 199 | 203 | 206 |
| 71" | 197 | 205 | 209 | 212 |
| 72" | 202 | 210 | 215 | 218 |
| 73" | 208 | 216 | 221 | 224 |
| 74" | 214 | 222 | 227 | 230 |
| 75" | 220 | 228 | 233 | 237 |
| 76" | 226 | 235 | 240 | 243 |
| 77" | 232 | 241 | 246 | 250 |
| 78" | 238 | 247 | 253 | 256 |
| 79" | 244 | 254 | 259 | 263 |
| 80" | 250 | 260 | 266 | 270 |

### Female Maximum Weight (lbs)
| Height | 17-20 | 21-27 | 28-39 | 40+ |
|--------|-------|-------|-------|-----|
| 58" | 120 | 124 | 126 | 127 |
| 59" | 124 | 128 | 130 | 131 |
| 60" | 128 | 132 | 134 | 135 |
| 61" | 132 | 136 | 139 | 140 |
| 62" | 136 | 141 | 143 | 145 |
| 63" | 141 | 145 | 148 | 149 |
| 64" | 145 | 150 | 152 | 154 |
| 65" | 150 | 155 | 157 | 159 |
| 66" | 155 | 160 | 163 | 164 |
| 67" | 159 | 165 | 168 | 169 |
| 68" | 164 | 170 | 173 | 174 |
| 69" | 169 | 175 | 178 | 180 |
| 70" | 174 | 180 | 183 | 185 |
| 71" | 179 | 185 | 189 | 191 |
| 72" | 184 | 191 | 194 | 196 |
| 73" | 189 | 196 | 200 | 202 |
| 74" | 194 | 202 | 205 | 208 |
| 75" | 200 | 207 | 211 | 214 |
| 76" | 205 | 213 | 217 | 219 |
| 77" | 210 | 219 | 223 | 225 |
| 78" | 216 | 225 | 229 | 232 |
| 79" | 221 | 230 | 235 | 238 |
| 80" | 227 | 236 | 241 | 244 |

### Body Fat Standards
| Gender | Max Body Fat |
|--------|--------------|
| Male | 18% |
| Female | 26% |

---

## Body Fat Calculation

### Tape Measurement Procedure

**Male:**
1. Neck: Measure at Adam's apple level, round UP to nearest 0.5"
2. Abdomen: Measure at navel level, round DOWN to nearest 0.5"
3. Circumference Value = Abdomen - Neck
4. Use DoD body fat table to find % (Height vs Circumference Value)

**Female:**
1. Neck: Measure at Adam's apple level, round UP to nearest 0.5"
2. Abdomen: Measure at navel level, round DOWN to nearest 0.5"
3. Hips: Measure at widest point, round DOWN to nearest 0.5"
4. Circumference Value = Abdomen + Hips - Neck
5. Use DoD body fat table to find % (Height vs Circumference Value)

---

## UI Structure

### Main Navigation (Tabs)
1. **PFT Calculator** - Individual score calculation
2. **CFT Calculator** - Individual score calculation
3. **HT/WT/BCP** - Height/weight and body composition
4. **Proctor Mode** - Full worksheet for monitoring Marines

### PFT Calculator Screen
```
┌─────────────────────────────────────┐
│         PFT CALCULATOR              │
├─────────────────────────────────────┤
│ Gender: [Male ▼]  Age: [25    ]     │
├─────────────────────────────────────┤
│ Upper Body Event:                   │
│ ○ Pull-ups  ○ Push-ups              │
│                                     │
│ Reps: [____]        Points: [__]    │
├─────────────────────────────────────┤
│ Core Event:                         │
│ Plank Time: [__:__]  Points: [__]   │
├─────────────────────────────────────┤
│ Cardio Event:                       │
│ ○ 3-Mile Run  ○ 5k Row              │
│ □ High Altitude (4,500ft+)          │
│                                     │
│ Time: [__:__]       Points: [__]    │
├─────────────────────────────────────┤
│         TOTAL: [___] pts            │
│         CLASS: [1st Class]          │
│         GRADE: [A]                  │
├─────────────────────────────────────┤
│  [Reset]              [Save PDF]    │
└─────────────────────────────────────┘
```

### Proctor Worksheet Screen
```
┌─────────────────────────────────────┐
│      PROCTOR WORKSHEET              │
│      PFT ○  CFT ○                   │
├─────────────────────────────────────┤
│ Marine Information:                 │
│ Name: [________________]            │
│ Rank: [Cpl ▼]  EDIPI: [__________] │
│ DOB: [MM/DD/YYYY]  Gender: [M ▼]   │
├─────────────────────────────────────┤
│ Event Scores:                       │
│ [Event 1]: [___]     [__] pts       │
│ [Event 2]: [___]     [__] pts       │
│ [Event 3]: [___]     [__] pts       │
├─────────────────────────────────────┤
│ TOTAL: [___] pts   CLASS: [___]     │
├─────────────────────────────────────┤
│ [Add to Session]  [Generate PDF]    │
├─────────────────────────────────────┤
│ Session (3 Marines):                │
│ • SSgt Smith, John - 285 (1st)      │
│ • Cpl Jones, Mary - 247 (1st)       │
│ • LCpl Brown, Tim - 198 (3rd)       │
└─────────────────────────────────────┘
```

---

## PDF Output Format

Match NAVMC 11622 layout:
- Unit name and date at top
- Marine info (Name, Rank, EDIPI, Age, Gender, Height, Weight)
- PHA date (optional)
- Event columns: Event | Raw Score | Points
- Total score and classification
- Monitor signature line

---

## Technical Implementation

### Files
```
pft-cft-proctor/
├── index.html
├── manifest.json
├── service-worker.js
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── scoring-tables.js    # All scoring data
│   ├── calculator.js        # Score calculation logic
│   ├── bodyfat.js           # BCP calculations
│   ├── pdf-generator.js     # jsPDF implementation
│   └── storage.js           # LocalStorage helpers
├── assets/
│   ├── icon-192.png
│   └── icon-512.png
├── README.md
└── LICENSE
```

### Key Functions

```javascript
// Calculate PFT score
function calculatePFTScore(gender, age, pullups, pushups, plankTime, runTime, isAltitude, isRow) {
  // Returns { upperBody: pts, core: pts, cardio: pts, total: pts, class: string, grade: string }
}

// Calculate CFT score
function calculateCFTScore(gender, age, mtcTime, ammoLifts, manufTime, isAltitude) {
  // Returns { mtc: pts, al: pts, manuf: pts, total: pts, class: string, grade: string }
}

// Calculate body fat
function calculateBodyFat(gender, height, neck, abdomen, hips) {
  // Returns { circumference: number, bodyFat: number, withinStandard: boolean }
}

// Check height/weight standard
function checkWeightStandard(gender, age, height, weight) {
  // Returns { maxWeight: number, overBy: number, requiresBCP: boolean }
}

// Generate PDF
function generatePDFReport(marines, testType, unit, date) {
  // Returns jsPDF document
}
```

### Scoring Interpolation

For run times and plank, use linear interpolation:
```javascript
function interpolateScore(value, minValue, maxValue, minScore, maxScore) {
  if (value <= maxValue) return maxScore; // Better than max
  if (value >= minValue) return minScore; // Worse than min
  
  const range = minValue - maxValue;
  const scoreRange = maxScore - minScore;
  const position = (value - maxValue) / range;
  
  return Math.round(maxScore - (position * scoreRange));
}
```

---

## Testing Checklist

- [ ] All age brackets calculate correctly (17-20, 21-25, 26-30, 31-35, 36-40, 41-45, 46-50, 51+)
- [ ] Male and female scoring tables work correctly
- [ ] Pull-ups vs push-ups toggles properly
- [ ] 70-point cap on push-ups enforced
- [ ] Plank scoring interpolates correctly
- [ ] Run times interpolate correctly
- [ ] Altitude adjustment applies correctly
- [ ] 5k row available only for 46+ or when enabled
- [ ] Classification thresholds correct (150/200/235)
- [ ] PDF generates with correct format
- [ ] Works offline after first load
- [ ] Night mode functions properly
- [ ] Mobile responsive at all breakpoints

---

## Community Attribution

This tool was inspired by feedback from the r/USMC community:

| Contributor | Platform | Contribution |
|-------------|----------|--------------|
| **BigEarn86** | r/USMC | Original idea for mobile PFT/CFT proctor app - "this is genius, maybe I could roll out a mobile friendly browser based app" |

*This tool exists because Marines took the time to share their pain points. Thank you.*

---

## Deployment

1. Push to GitHub repo `jeranaias/pft-cft-proctor`
2. Enable GitHub Pages from main branch
3. Test at `https://jeranaias.github.io/pft-cft-proctor/`

---

## Git Commit Guidelines

**IMPORTANT:** Do NOT include any Claude, Anthropic, or AI attribution in commit messages. Keep commits professional and human-authored in tone:

```
# GOOD commit messages:
git commit -m "Add PFT scoring tables for all age groups"
git commit -m "Fix plank time interpolation bug"
git commit -m "Implement PDF export for proctor worksheet"

# BAD commit messages (do not use):
git commit -m "Generated by Claude..."
git commit -m "AI-assisted implementation of..."
```

---

*Spec Version 1.0 - December 2025*
