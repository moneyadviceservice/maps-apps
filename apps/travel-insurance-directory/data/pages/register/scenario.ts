import { PageData } from './types';

const genericAssumptions = [
  { label: 'Date of travel to occur within one month of policy inception.' },
  { label: 'Assume travel by aeroplane for all trips.' },
  {
    label:
      'Assume no claims made on a travel insurance policy over previous two years.',
  },
  { label: 'Assume no non-routine health appointments are scheduled.' },
  {
    label:
      'Assume that customer is not awaiting on undergoing any diagnostic tests, test results or treatment (unless specified).',
  },
  {
    label:
      'Assume that customer had not been admitted to hospital in last two years, unless stated.',
  },
  {
    label:
      "Assume that customer is not participating in any 'experimental' drug programmes.",
  },
  {
    label:
      "Where process requires further information, a 'neutral' outcome should be selected (e.g. that would not in itself increase risk or require additional clarification).",
  },
  {
    label: 'In all cases reasonable assumptions and judgements to be applied.',
  },
];

const scenariosRaw = [
  {
    id: 1,
    title: 'Metastatic Breast cancer',
    primary:
      'Stage 4 breast cancer that has spread to the liver and lungs. Taking tamoxifen only at this stage with no other treatment planned. The condition is relatively stable with the latest scan showing no change in tumour activity. Able to carry out usual activities and not requiring any strong painkillers. Appointments typically held every three months.',
    secondary: 'None.',
    age: '65.',
    trip: 'Single trip to France for three weeks.',
    key: 'metastatic_breast_cancer',
  },
  {
    id: 2,
    title: 'Ulcerative Colitis and anaemia',
    primary:
      'Ulcerative colitis with two unplanned hospital admissions within the last two years. Surgery one month ago to remove a diseased section of bowel. Requires three different medicines daily. No previous episodes of bowel obstruction. No stoma. No changes to medication in last three months. A post operation consultation is scheduled but no further appointments scheduled.',
    secondary:
      'Anaemia with one blood test in the last year. No blood transfusions.',
    age: '65.',
    trip: 'Single trip to Spain for three weeks.',
    key: 'ulceritive_colitis_and_anaemia',
  },
  {
    id: 3,
    title: 'Heart attack with High Blood Pressure and High Cholesterol',
    primary:
      'Three heart attacks with the most recent three months ago treated with three stents. Continues to have chest pains despite recent procedure but only on exertion and not at rest. Can walk 200 metres on the flat without getting breathless. Not currently waiting for any new tests or investigations. Average weight (is not over or under weight).',
    secondary:
      'Takes two medications for high blood pressure with a recent increase in the dosage following the latest heart attack. Takes statins for high cholesterol levels and continues to smoke daily. No other medication taken.',
    age: '65.',
    trip: 'Single trip to USA for three weeks.',
    key: 'heart_attack_with_hbp_and_high_cholesterol',
  },
  {
    id: 4,
    title: 'COPD with recent respiratory infection',
    primary:
      'Chronic Obstructive Pulmonary Disease requiring five daily medications to manage (in both inhaler and tablet form). A nebuliser is required. One recent hospital admission (within last six months) for an infective exacerbation of the condition (pneumonia) requiring IV antibiotic treatment. Gets short of breath walking 200 metres on the flat although not yet required any oxygen outside of hospital. Recent smoker having given up in the last year. No other comorbidities. Average weight (is not over or under weight).',
    secondary: 'None.',
    age: '65.',
    trip: 'Single trip to Spain for three weeks.',
    key: 'copd_with_respiratory_infection',
  },
  {
    id: 5,
    title: 'Motor neurone disease',
    primary:
      'Amyotrophic lateral sclerosis (a form of motor neurone disease) diagnosed 18 months ago. Now requiring a wheelchair to mobilise. Requires assistance with washing, dressing and eating. Not yet requiring ventilatory assistance nor having issues with swallowing. Medication sometimes used to manage symptoms of condition, such as muscle cramps.',
    secondary: 'None.',
    age: '65.',
    trip: 'Single trip to Spain for three weeks.',
    key: 'motor_neurone_disease',
  },
  {
    id: 6,
    title: 'Hodgkin Lymphoma',
    primary:
      'Stage 4 Hodgkin lymphoma with no remission and treatment is ongoing (chemotherapy every four weeks). No recurrent infections. No symptoms.',
    secondary: 'None.',
    age: '65.',
    trip: 'Single trip to France for three weeks.',
    key: 'hodgkin_lymphoma',
  },
  {
    id: 7,
    title: 'Acute Myeloid Leukaemia',
    primary:
      'Acute myeloid leukaemia, Initial remission was achieved but relapsed. No treatment required for the last two years.',
    secondary: 'None.',
    age: '14.',
    trip: 'Single trip to France for three weeks.',
    key: 'acute_myeloid_leukaemia',
  },
  {
    id: 8,
    title: 'Guillain-Barré Syndrome',
    primary:
      'Guillain-Barré syndrome still active following a relapse. Limb weakness present and unable to carry out normal activities of daily living. No breathing difficulties. No associated complications. No medication taken.',
    secondary: 'None.',
    age: '65.',
    trip: 'Single trip to Spain for three weeks.',
    key: 'guillain_barre_syndrome',
  },
  {
    id: 9,
    title: 'Heart Failure and arrhythmia',
    primary:
      'Congestive cardiac failure with symptoms (e.g. ankle swelling) for over three years. Taking four medications, unable to lie flat without becoming breathless and gets mildly short of breath when walking. Has required a visit to A&E within the last 12 months (11 months ago). Never required oxygen other than when in hospital, gave up smoking over a year ago, no ischaemic heart disease. GTN spray not used. Average weight (is not over or under weight).',
    secondary:
      'Arrhythmia, takes medication only, no visits to hospital within the last year, takes anticoagulants, not symptomatic.',
    age: '65.',
    trip: 'Single trip to Spain for three weeks.',
    key: 'heart_failure_and_arrhytmia',
  },
  {
    id: 10,
    title: 'Stroke with High Blood Pressure and High Cholesterol',
    primary:
      'Three strokes in total, the most recent being four months ago and has had several transient ischaemic attacks since. Taking anti-coagulant medication. Still smoking. Awaiting scans and possibly surgery required. No atrial fibrillation.',
    secondary:
      'High Blood Pressure and High Cholesterol. Two medications taken for HBP and one medication for raised HCL. No changes to medication recently.',
    age: '65.',
    trip: 'Single trip to USA for three weeks.',
    key: 'stroke_with_hbp',
  },
  {
    id: 11,
    title:
      'Peripheral Vascular Disease with High Blood Pressure and High Cholesterol',
    primary:
      'Two medications for high blood pressure with no recent dose changes. Takes medication for high cholesterol levels.',
    secondary:
      'Also has Peripheral vascular disease with no amputations due to poor blood supply but has had a procedure to widen the vessels and has pain in calves when walking with two unplanned hospital admissions within the last two years (last one year ago). Still smoking. No medication taken for PVD. Blood pressure within normal limits when last measured.',
    age: '65.',
    trip: 'Single trip to France for three weeks.',
    key: 'peripheral_vascular_disease',
  },
  {
    id: 12,
    title: 'Schizophrenia',
    primary:
      'Schizophrenia with a compulsory admission to hospital six months ago (no other hospital trips within the last two years). Compliant with medication which has been taken throughout the last two years (and no recent change in medication over last three months). Travelling with partner (who is familiar with management of condition). Onset of condition was not travel related. Not currently experiencing any symptoms. Does not require assistance for day-to-day activities.',
    secondary: 'None.',
    age: '65.',
    trip: 'Single trip to France for three weeks.',
    key: 'schizophrenia',
  },
  {
    id: 13,
    title: 'Lupus with pericarditis and Neuropathy',
    primary:
      'Lupus diagnosed within the last 12 months. Takes two medications (oral) and required one unplanned hospital admission six months ago. No change in medication in last 12 months. No deterioration in lupus in last six months. One episode of pericarditis two years ago requiring surgery to remove the pericardium. No lasting heart damage but still not made a full recovery. Also developed nerve damage which interferes with activities of daily living and required a hospital admission within the last year. Needs a walking stick for mobility. Appointments typically held every six months.',
    secondary: 'Incorporated into above description.',
    age: '65.',
    trip: 'Single trip to USA for three weeks.',
    key: 'lupus',
  },
  {
    id: 14,
    title: 'Sickle cell anaemia and renal disease',
    primary:
      'Sickle cell anaemia with a crisis within the last year requiring admission and blood transfusions. Admission and blood transfusion around six months ago. Single blood transfusion of two units. No bone marrow transplant so far. No ongoing medication. Haemoglobin level of 8g/dL.',
    secondary:
      'Renal disease: No dialysis, no transplant. Under review by specialist.',
    age: '65.',
    trip: 'Single trip to USA for three weeks.',
    key: 'sickle_cell_and_renal',
  },
  {
    id: 15,
    title: 'Sub-arachnoid haemorrhage with epilepsy',
    primary:
      'Sub-arachnoid haemorrhage due to aneurysm two years ago. Aneurysm caused by berry aneurysm in Circle of Willis. Still has unsecured aneurysms in the brain. Walks with a stick and has developed epilepsy. Three seizures (of less than 30 minutes) causing loss of consciousness within the last six months, one of which was within the last four weeks. Takes two medications (for epilepsy) and no hospital admissions within the last 12 months. First seizure was more than 12 months ago. No surgery planned.',
    secondary: 'None.',
    age: '65.',
    trip: 'Single trip to Spain for three weeks.',
    key: 'sub_arachnoid_haemorrhage_and_epilepsy',
  },
  {
    id: 16,
    title: 'Prostate Cancer',
    primary:
      'Stage two prostate cancer, taking bicalutamide once a day and has been for 16 months, no side effects from taking the medication. Continues to lead an active life, balancing treatment with daily activities. Appointments typically held every three months. No surgery planned currently. No hospital admissions in the last 12 months.',
    secondary: 'None.',
    age: '70',
    trip: 'Single trip to Europe for five weeks',
    key: 'prostate_cancer',
  },
  {
    id: 17,
    title: 'Type 1 Diabetes',
    primary:
      'Type 1 diabetes. Diagnosed five years ago.  Insulin is administered using a tubeless insulin pump based on blood sugar levels which are monitored through a continuous glucose monitor (CGM) that communicates with the pump. Has quarterly check-ups with the GP, no concerns following the last visit. No hospital admissions in the last 12 months.',
    secondary: 'None.',
    age: '86.',
    trip: 'Annual European policy including cruise cover',
    key: 'type_one_diabetes',
  },
  {
    id: 18,
    title: "Parkinson's Disease",
    primary:
      "Parkinson's Disease, diagnosed three years ago. Taking Levodopa to start the day to help reduce stiffness and improve mobility, followed by a slow and careful routine to perform daily activities. Also taking Benserazide to reduce side effects of Levodopa. Regular exercise such as daily walking. Sees a specialist every 12 months.",
    secondary: 'None.',
    age: '65.',
    trip: 'Annual worldwide, excluding USA & Canada policy',
    key: 'parkinsons_disease',
  },
  {
    id: 19,
    title: 'HIV',
    primary:
      'HIV, diagnosed two years ago, taking antiretroviral therapy (ART) medications. Maintains a balanced diet to support immune system and overall health. Regular exercise and strength training, maintaining physical and mental well-being. Sees specialist every six months for lab tests. No hospital admissions in the last 12 months.',
    secondary: 'None.',
    age: '75.',
    trip: 'Annual worldwide including USA & Canada policy',
    key: 'hiv',
  },
];

export const page: PageData = scenariosRaw.reduce((acc, s) => {
  acc[`step${s.id}`] = {
    heading: s.title,
    backLink:
      s.id > 1 ? `/register/scenario/step${s.id - 1}` : `/register/scenario`,
    copy: [
      {
        component: 'span',
        content: `Scenario ${s.id} of 19`,
        style: 'mt-2 mb-4 text-2xl',
      },
      {
        component: 'callout',
        heading: {
          component: 'heading',
          content: 'Primary health condition:',
          level: 'h2',
        },
        copy: [
          {
            component: 'paragraph',
            style: '',
            content: s.primary,
          },
          {
            component: 'list',
            style: '',
            items: [
              { label: 'Secondary Health Condition:', hintText: s.secondary },
              { label: 'Age:', hintText: s.age },
              { label: 'Trip:', hintText: s.trip },
            ],
          },
        ],
      },
      {
        component: 'heading',
        level: 'h3',
        style: 'my-8',
        content: 'Generic circumstances and assumptions:',
      },
      {
        component: 'list',
        style: '',
        items: genericAssumptions,
      },
    ],
    radioInput: {
      key: s.key,
      title:
        'Would you offer single trip cover (without medical exclusions) for the scenario above?',
      layout: 'row',
      options: [
        { label: 'Yes', value: 'true' },
        { label: 'No', value: 'false' },
      ],
    },
  };
  return acc;
}, {} as PageData);
