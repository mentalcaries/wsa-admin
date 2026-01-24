import type { Problem } from '~/types';

export const initialProblems: Problem[] = [
  {
    id: '1',
    name: 'Tubing Hanger/Seal Leak',
    solutions: [
      {
        id: '1A',
        text: 'Replace tubing hanger seals with upgraded elastomer compounds rated for higher temperatures and pressures.',
        displayOrder: 1,
      },
      {
        id: '1B',
        text: 'Conduct pressure testing before and after workover operations to verify seal integrity.',
        displayOrder: 2,
      },
      {
        id: '1C',
        text: 'Install metal-to-metal seal assemblies for high-pressure applications.',
        displayOrder: 3,
      },
      {
        id: '1D',
        text: 'Implement regular annular pressure monitoring program.',
        displayOrder: 4,
      },
      {
        id: '1E',
        text: 'Use corrosion-resistant materials for tubing hangers in H2S environments.',
        displayOrder: 5,
      },
      {
        id: '1F',
        text: 'Apply proper makeup torque according to manufacturer specifications.',
        displayOrder: 6,
      },
      {
        id: '1G',
        text: 'Install backup sealing systems for critical wells.',
        displayOrder: 7,
      },
      {
        id: '1H',
        text: 'Perform thermal cycling tests on seal assemblies before installation.',
        displayOrder: 8,
      },
      {
        id: '1I',
        text: 'Use compatible lubricants during assembly to prevent seal damage.',
        displayOrder: 9,
      },
      {
        id: '1J',
        text: 'Implement seal replacement schedule based on well conditions and age.',
        displayOrder: 10,
      },
      {
        id: '1K',
        text: 'Conduct visual inspection of seal surfaces for damage before installation.',
        displayOrder: 11,
      },
      {
        id: '1L',
        text: 'Document all seal-related issues for trend analysis and prevention.',
        displayOrder: 12,
      },
    ],
    active: true,
    displayOrder: 1,
  },
  {
    id: '2',
    name: 'Casing Pressure Build-up',
    solutions: [
      {
        id: '2A',
        text: 'Bleed off casing pressure through approved procedures and disposal methods.',
        displayOrder: 1,
      },
      {
        id: '2B',
        text: 'Install pressure relief valves with appropriate set points.',
        displayOrder: 2,
      },
      {
        id: '2C',
        text: 'Conduct cement bond log to identify communication paths.',
        displayOrder: 3,
      },
      {
        id: '2D',
        text: 'Perform squeeze cementing operations to seal leak paths.',
        displayOrder: 4,
      },
      {
        id: '2E',
        text: 'Monitor and record casing pressure trends for analysis.',
        displayOrder: 5,
      },
      {
        id: '2F',
        text: 'Install pressure monitoring systems for continuous surveillance.',
        displayOrder: 6,
      },
      {
        id: '2G',
        text: 'Evaluate thermal effects on casing pressure during production.',
        displayOrder: 7,
      },
      {
        id: '2H',
        text: 'Consider casing patch or liner installation for severe cases.',
        displayOrder: 8,
      },
    ],
    active: true,
    displayOrder: 2,
  },
  {
    id: '3',
    name: 'Wellhead Equipment Failure',
    solutions: [
      {
        id: '3A',
        text: 'Implement preventive maintenance program for all wellhead components.',
        displayOrder: 1,
      },
      {
        id: '3B',
        text: 'Conduct regular visual inspections for corrosion and wear.',
        displayOrder: 2,
      },
      {
        id: '3C',
        text: 'Replace worn or damaged valves before complete failure.',
        displayOrder: 3,
      },
      {
        id: '3D',
        text: 'Install cathodic protection systems to prevent external corrosion.',
        displayOrder: 4,
      },
      {
        id: '3E',
        text: 'Use appropriate materials selection based on well fluids.',
        displayOrder: 5,
      },
      {
        id: '3F',
        text: 'Train personnel on proper operation procedures.',
        displayOrder: 6,
      },
      {
        id: '3G',
        text: 'Keep spare parts inventory for critical components.',
        displayOrder: 7,
      },
      {
        id: '3H',
        text: 'Document all equipment failures for root cause analysis.',
        displayOrder: 8,
      },
      {
        id: '3I',
        text: 'Implement pressure testing schedule for wellhead integrity.',
        displayOrder: 9,
      },
      {
        id: '3J',
        text: 'Install protective covers and enclosures where applicable.',
        displayOrder: 10,
      },
      {
        id: '3K',
        text: 'Monitor valve stem packing for leaks during operations.',
        displayOrder: 11,
      },
      {
        id: '3L',
        text: 'Review and update maintenance procedures annually.',
        displayOrder: 12,
      },
      {
        id: '3M',
        text: 'Use manufacturer-certified replacement parts only.',
        displayOrder: 13,
      },
      {
        id: '3N',
        text: 'Install automated shutdown systems for critical failures.',
        displayOrder: 14,
      },
      {
        id: '3O',
        text: 'Conduct periodic ultrasonic thickness measurements.',
        displayOrder: 15,
      },
    ],
    active: true,
    displayOrder: 3,
  },
  {
    id: '4',
    name: 'Sand Production Issues',
    solutions: [
      {
        id: '4A',
        text: 'Install gravel pack completion to control sand production.',
        displayOrder: 1,
      },
      {
        id: '4B',
        text: 'Use sand screens with appropriate slot sizes.',
        displayOrder: 2,
      },
      {
        id: '4C',
        text: 'Apply chemical consolidation treatments to formation.',
        displayOrder: 3,
      },
      {
        id: '4D',
        text: 'Optimize production rates to minimize sand influx.',
        displayOrder: 4,
      },
      { id: '4E', text: 'Install downhole sand separators.', displayOrder: 5 },
      {
        id: '4F',
        text: 'Monitor sand production rates and adjust as needed.',
        displayOrder: 6,
      },
    ],
    active: true,
    displayOrder: 4,
  },
  {
    id: '5',
    name: 'Corrosion and Scale Buildup',
    solutions: [
      {
        id: '5A',
        text: 'Implement chemical injection program for corrosion inhibitors.',
        displayOrder: 1,
      },
      {
        id: '5B',
        text: 'Install scale inhibitor squeeze treatments.',
        displayOrder: 2,
      },
      {
        id: '5C',
        text: 'Use corrosion-resistant alloys for critical components.',
        displayOrder: 3,
      },
      {
        id: '5D',
        text: 'Conduct regular coupon monitoring for corrosion rates.',
        displayOrder: 4,
      },
      {
        id: '5E',
        text: 'Perform periodic scale removal operations.',
        displayOrder: 5,
      },
      {
        id: '5F',
        text: 'Install cathodic protection systems.',
        displayOrder: 6,
      },
      {
        id: '5G',
        text: 'Monitor water chemistry for scaling tendency.',
        displayOrder: 7,
      },
      {
        id: '5H',
        text: 'Apply internal coatings to tubulars where applicable.',
        displayOrder: 8,
      },
      {
        id: '5I',
        text: 'Review and optimize chemical treatment programs quarterly.',
        displayOrder: 9,
      },
    ],
    active: true,
    displayOrder: 5,
  },
  {
    id: '6',
    name: 'Artificial Lift System Failure',
    solutions: [
      {
        id: '6A',
        text: 'Implement predictive maintenance using vibration analysis.',
        displayOrder: 1,
      },
      {
        id: '6B',
        text: 'Monitor pump performance curves for efficiency decline.',
        displayOrder: 2,
      },
      {
        id: '6C',
        text: 'Use variable speed drives for optimal operation.',
        displayOrder: 3,
      },
      {
        id: '6D',
        text: 'Keep adequate spare parts inventory.',
        displayOrder: 4,
      },
      {
        id: '6E',
        text: 'Train operators on proper startup and shutdown procedures.',
        displayOrder: 5,
      },
      {
        id: '6F',
        text: 'Install downhole sensors for real-time monitoring.',
        displayOrder: 6,
      },
      {
        id: '6G',
        text: 'Review lift system sizing annually.',
        displayOrder: 7,
      },
    ],
    active: true,
    displayOrder: 6,
  },
  {
    id: '7',
    name: 'Paraffin and Asphaltene Deposition',
    solutions: [
      {
        id: '7A',
        text: 'Implement hot oil or hot water treatments.',
        displayOrder: 1,
      },
      {
        id: '7B',
        text: 'Use chemical solvents for paraffin removal.',
        displayOrder: 2,
      },
      {
        id: '7C',
        text: 'Install heating elements in tubing.',
        displayOrder: 3,
      },
      {
        id: '7D',
        text: 'Apply pour point depressant treatments.',
        displayOrder: 4,
      },
      {
        id: '7E',
        text: 'Perform regular scraping operations.',
        displayOrder: 5,
      },
    ],
    active: false,
    displayOrder: 7,
  },
  {
    id: '8',
    name: 'Gas Lock in Pumping Wells',
    solutions: [
      {
        id: '8A',
        text: 'Install gas separators below the pump.',
        displayOrder: 1,
      },
      {
        id: '8B',
        text: 'Lower pump setting depth below gas entry points.',
        displayOrder: 2,
      },
      {
        id: '8C',
        text: 'Use compression-type pumps designed for gassy wells.',
        displayOrder: 3,
      },
      { id: '8D', text: 'Install gas venting systems.', displayOrder: 4 },
      {
        id: '8E',
        text: 'Optimize pump speed to handle gas volumes.',
        displayOrder: 5,
      },
      {
        id: '8F',
        text: 'Consider gas lift conversion for high GOR wells.',
        displayOrder: 6,
      },
      {
        id: '8G',
        text: 'Use larger tubing to reduce gas velocity.',
        displayOrder: 7,
      },
      {
        id: '8H',
        text: 'Install surface gas handling equipment.',
        displayOrder: 8,
      },
      {
        id: '8I',
        text: 'Monitor pump fillage and adjust accordingly.',
        displayOrder: 9,
      },
      {
        id: '8J',
        text: 'Evaluate completion design for gas management.',
        displayOrder: 10,
      },
      {
        id: '8K',
        text: 'Use pump-off controllers for efficient operation.',
        displayOrder: 11,
      },
    ],
    active: true,
    displayOrder: 8,
  },
  {
    id: '9',
    name: 'Hydrate Formation',
    solutions: [
      {
        id: '9A',
        text: 'Inject methanol or glycol as hydrate inhibitors.',
        displayOrder: 1,
      },
      {
        id: '9B',
        text: 'Apply heat to maintain temperatures above hydrate formation.',
        displayOrder: 2,
      },
      {
        id: '9C',
        text: 'Reduce pressure to shift outside hydrate stability zone.',
        displayOrder: 3,
      },
      {
        id: '9D',
        text: 'Use insulated tubing and flowlines.',
        displayOrder: 4,
      },
      { id: '9E', text: 'Install electric heating cables.', displayOrder: 5 },
      {
        id: '9F',
        text: 'Monitor for hydrate formation conditions.',
        displayOrder: 6,
      },
      {
        id: '9G',
        text: 'Implement emergency depressurization procedures.',
        displayOrder: 7,
      },
      {
        id: '9H',
        text: 'Use low-dosage hydrate inhibitors where applicable.',
        displayOrder: 8,
      },
    ],
    active: true,
    displayOrder: 9,
  },
  {
    id: '10',
    name: 'Water Production Management',
    solutions: [
      {
        id: '10A',
        text: 'Install mechanical water shutoff devices.',
        displayOrder: 1,
      },
      {
        id: '10B',
        text: 'Apply gel treatments for water conformance.',
        displayOrder: 2,
      },
      {
        id: '10C',
        text: 'Use selective perforation techniques.',
        displayOrder: 3,
      },
      {
        id: '10D',
        text: 'Install downhole water separation systems.',
        displayOrder: 4,
      },
    ],
    active: true,
    displayOrder: 10,
  },
];
