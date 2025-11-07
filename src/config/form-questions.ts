/**
 * SSA-3373 Form Question Configuration
 * Organized into logical groups for progressive disclosure
 */

import type { QuestionGroup } from '@/types/ssa-form';

export const FORM_QUESTION_GROUPS: QuestionGroup[] = [
  // Group 1: Personal Information
  {
    id: 'personal_info',
    title: 'Personal Information',
    description: 'Basic information about you',
    questions: [
      {
        id: 'name',
        label: 'Your full name',
        type: 'text',
        path: 'personal_information.name',
        required: true,
        placeholder: 'First Middle Last',
      },
      {
        id: 'ssn',
        label: 'Social Security Number',
        type: 'ssn',
        path: 'personal_information.social_security_number',
        required: true,
        placeholder: 'XXX-XX-XXXX',
        helpText: 'Your information is encrypted and stored only on your device',
        validation: {
          pattern: /^\d{3}-\d{2}-\d{4}$/,
          message: 'Please enter SSN in XXX-XX-XXXX format',
        },
      },
      {
        id: 'dob',
        label: 'Date of Birth',
        type: 'date',
        path: 'personal_information.date_of_birth',
        required: true,
        placeholder: 'MM/DD/YYYY',
      },
      {
        id: 'daytime_phone',
        label: 'Daytime Phone Number',
        type: 'phone',
        path: 'personal_information.daytime_phone',
        required: true,
        placeholder: '(555) 555-5555',
      },
      {
        id: 'alternate_phone',
        label: 'Alternate Phone Number (optional)',
        type: 'phone',
        path: 'personal_information.alternate_phone',
        placeholder: '(555) 555-5555',
      },
    ],
  },

  // Group 2: Daily Schedule
  {
    id: 'daily_schedule',
    title: 'Daily Schedule',
    description: 'Tell us about your typical daily routine',
    questions: [
      {
        id: 'wake_time',
        label: 'What time do you usually wake up?',
        type: 'time',
        path: 'daily_activities.wake_up_time',
        placeholder: '7:00 AM',
      },
      {
        id: 'sleep_time',
        label: 'What time do you usually go to sleep?',
        type: 'time',
        path: 'daily_activities.sleep_time',
        placeholder: '10:00 PM',
      },
    ],
  },

  // Group 3: Caring for Others
  {
    id: 'care_for_others',
    title: 'Caring for Others',
    description: 'Information about people or pets you care for',
    questions: [
      {
        id: 'cares_for_others',
        label: 'Do you take care of anyone else (children, spouse, parent, etc.)?',
        type: 'boolean',
        path: 'daily_activities.care_for_others.cares_for',
      },
      {
        id: 'who_care_for',
        label: 'Who do you care for?',
        type: 'text',
        path: 'daily_activities.care_for_others.who',
        placeholder: 'e.g., My 2 children, ages 5 and 8',
        conditional: {
          dependsOn: 'daily_activities.care_for_others.cares_for',
          value: true,
        },
      },
      {
        id: 'type_of_care',
        label: 'What type of care do you provide?',
        type: 'textarea',
        path: 'daily_activities.care_for_others.type_of_care',
        placeholder: 'Describe the care you provide...',
        conditional: {
          dependsOn: 'daily_activities.care_for_others.cares_for',
          value: true,
        },
      },
      {
        id: 'has_pets',
        label: 'Do you take care of pets?',
        type: 'boolean',
        path: 'daily_activities.care_for_pets.has_pets',
      },
      {
        id: 'pet_care',
        label: 'What kind of pet care do you provide?',
        type: 'text',
        path: 'daily_activities.care_for_pets.type_of_care',
        placeholder: 'e.g., Feeding, walking, grooming',
        conditional: {
          dependsOn: 'daily_activities.care_for_pets.has_pets',
          value: true,
        },
      },
    ],
  },

  // Group 4: Personal Care
  {
    id: 'personal_care',
    title: 'Personal Care',
    description: 'Your ability to care for yourself',
    questions: [
      {
        id: 'bathing_dressing_help',
        label: 'Do you need help or reminders with bathing, dressing, or personal care?',
        type: 'boolean',
        path: 'personal_care.bathing_dressing_care.needs_help',
      },
      {
        id: 'bathing_dressing_details',
        label: 'Explain what help you need',
        type: 'textarea',
        path: 'personal_care.bathing_dressing_care.details',
        placeholder: 'Describe the help you need...',
        conditional: {
          dependsOn: 'personal_care.bathing_dressing_care.needs_help',
          value: true,
        },
      },
      {
        id: 'toileting_help',
        label: 'Do you need help with toileting?',
        type: 'boolean',
        path: 'personal_care.toileting.needs_help',
      },
      {
        id: 'toileting_details',
        label: 'Explain what help you need',
        type: 'textarea',
        path: 'personal_care.toileting.details',
        placeholder: 'Describe the help you need...',
        conditional: {
          dependsOn: 'personal_care.toileting.needs_help',
          value: true,
        },
      },
      {
        id: 'feeding_help',
        label: 'Do you need help with feeding yourself?',
        type: 'boolean',
        path: 'personal_care.feeding.needs_help',
      },
      {
        id: 'feeding_details',
        label: 'Explain what help you need',
        type: 'textarea',
        path: 'personal_care.feeding.details',
        placeholder: 'Describe the help you need...',
        conditional: {
          dependsOn: 'personal_care.feeding.needs_help',
          value: true,
        },
      },
    ],
  },

  // Group 5: Household Activities
  {
    id: 'household_activities',
    title: 'Household Activities',
    description: 'Meal preparation and household chores',
    questions: [
      {
        id: 'meal_frequency',
        label: 'How often do you prepare meals?',
        type: 'text',
        path: 'household_activities.prepare_meals.frequency',
        placeholder: 'e.g., Daily, 2-3 times per week, Never',
      },
      {
        id: 'meal_types',
        label: 'What types of meals do you prepare?',
        type: 'text',
        path: 'household_activities.prepare_meals.types_of_meals',
        placeholder: 'e.g., Simple sandwiches, microwave meals, full dinners',
      },
      {
        id: 'meal_time',
        label: 'How long does it take to prepare a meal?',
        type: 'text',
        path: 'household_activities.prepare_meals.time_to_prepare',
        placeholder: 'e.g., 15 minutes, 1 hour',
      },
      {
        id: 'meal_changes',
        label: 'Did your illness affect your ability to prepare meals?',
        type: 'textarea',
        path: 'household_activities.prepare_meals.changes_before_illness',
        placeholder: 'Describe how meal preparation has changed...',
      },
    ],
  },

  // Group 6: House and Yard Work
  {
    id: 'house_yard_work',
    title: 'House and Yard Work',
    description: 'Household chores you do',
    questions: [
      {
        id: 'household_chores',
        label: 'What household chores or yard work do you do?',
        type: 'checklist',
        path: 'household_activities.house_and_yard_work.activities',
        options: [
          'Cleaning',
          'Laundry',
          'Dishes',
          'Vacuuming',
          'Dusting',
          'Yard work',
          'Taking out trash',
          'Making beds',
          'None',
        ],
      },
      {
        id: 'chore_frequency',
        label: 'How often do you do these activities?',
        type: 'text',
        path: 'household_activities.house_and_yard_work.frequency',
        placeholder: 'e.g., Daily, Weekly, Monthly',
      },
      {
        id: 'chore_time',
        label: 'How long does it take?',
        type: 'text',
        path: 'household_activities.house_and_yard_work.time_required',
        placeholder: 'e.g., 30 minutes per day',
      },
      {
        id: 'chore_changes',
        label: 'Did your illness affect your ability to do these activities?',
        type: 'textarea',
        path: 'household_activities.house_and_yard_work.changes_before_illness',
        placeholder: 'Describe how your abilities have changed...',
      },
    ],
  },

  // Group 7: Transportation and Going Out
  {
    id: 'transportation',
    title: 'Transportation and Going Out',
    description: 'Your ability to travel and go places',
    questions: [
      {
        id: 'go_out_alone',
        label: 'Can you go out alone?',
        type: 'boolean',
        path: 'going_places.can_go_out_alone',
      },
      {
        id: 'go_out_frequency',
        label: 'How often do you go out?',
        type: 'text',
        path: 'going_places.go_out_frequency',
        placeholder: 'e.g., Daily, Weekly, Rarely',
      },
      {
        id: 'can_drive',
        label: 'Can you drive?',
        type: 'boolean',
        path: 'going_places.transportation.can_drive',
      },
      {
        id: 'drive_frequency',
        label: 'How often do you drive?',
        type: 'text',
        path: 'going_places.transportation.drive_frequency',
        placeholder: 'e.g., Daily, Weekly, Occasionally',
        conditional: {
          dependsOn: 'going_places.transportation.can_drive',
          value: true,
        },
      },
      {
        id: 'reasons_not_drive',
        label: 'Why don\'t you drive?',
        type: 'textarea',
        path: 'going_places.transportation.reasons_not_drive',
        placeholder: 'Explain why you cannot or do not drive...',
        conditional: {
          dependsOn: 'going_places.transportation.can_drive',
          value: false,
        },
      },
    ],
  },

  // Group 8: Shopping and Money Management
  {
    id: 'shopping_money',
    title: 'Shopping and Money Management',
    description: 'Your ability to shop and handle finances',
    questions: [
      {
        id: 'can_shop',
        label: 'Can you shop for groceries or other items?',
        type: 'boolean',
        path: 'going_places.shopping.can_shop',
      },
      {
        id: 'what_shop_for',
        label: 'What do you shop for?',
        type: 'text',
        path: 'going_places.shopping.what_shop_for',
        placeholder: 'e.g., Groceries, clothing, household items',
        conditional: {
          dependsOn: 'going_places.shopping.can_shop',
          value: true,
        },
      },
      {
        id: 'shopping_frequency',
        label: 'How often do you shop?',
        type: 'text',
        path: 'going_places.shopping.frequency',
        placeholder: 'e.g., Weekly, Monthly',
        conditional: {
          dependsOn: 'going_places.shopping.can_shop',
          value: true,
        },
      },
      {
        id: 'can_handle_money',
        label: 'Can you handle money (pay bills, use checkbook, count change)?',
        type: 'boolean',
        path: 'going_places.money_management.can_handle_money',
      },
      {
        id: 'money_tasks',
        label: 'What money-related tasks do you handle?',
        type: 'checklist',
        path: 'going_places.money_management.tasks',
        options: ['Pay bills', 'Use checkbook', 'Use money orders', 'Count change', 'Use ATM', 'Online banking'],
        conditional: {
          dependsOn: 'going_places.money_management.can_handle_money',
          value: true,
        },
      },
    ],
  },

  // Group 9: Social Activities
  {
    id: 'social_activities',
    title: 'Social Activities and Hobbies',
    description: 'Your hobbies and social interactions',
    questions: [
      {
        id: 'hobbies',
        label: 'What are your current hobbies or interests?',
        type: 'textarea',
        path: 'social_activities.hobbies_and_interests.current_hobbies',
        placeholder: 'List your hobbies and interests...',
        helpText: 'Enter each hobby on a separate line or separated by commas',
      },
      {
        id: 'hobby_frequency',
        label: 'How often do you engage in these hobbies?',
        type: 'text',
        path: 'social_activities.hobbies_and_interests.frequency',
        placeholder: 'e.g., Daily, Weekly, Rarely',
      },
      {
        id: 'hobby_changes',
        label: 'How have your hobbies changed since your illness?',
        type: 'textarea',
        path: 'social_activities.hobbies_and_interests.changes_before_illness',
        placeholder: 'Describe how your hobbies have changed...',
      },
      {
        id: 'time_with_others_frequency',
        label: 'How often do you spend time with others?',
        type: 'text',
        path: 'social_activities.time_with_others.frequency',
        placeholder: 'e.g., Daily, Weekly, Rarely',
      },
      {
        id: 'social_changes',
        label: 'How has your social life changed since your illness?',
        type: 'textarea',
        path: 'social_activities.time_with_others.changes_before_illness',
        placeholder: 'Describe how your social activities have changed...',
      },
    ],
  },

  // Group 10: Functional Limitations
  {
    id: 'functional_limitations',
    title: 'Functional Limitations',
    description: 'How your illness affects your abilities',
    questions: [
      {
        id: 'affected_abilities',
        label: 'Which of these abilities are affected by your illness?',
        type: 'checklist',
        path: 'functional_limitations.affected_abilities',
        options: [
          'Lifting',
          'Squatting',
          'Bending',
          'Standing',
          'Reaching',
          'Walking',
          'Sitting',
          'Kneeling',
          'Climbing stairs',
          'Remembering',
          'Completing tasks',
          'Concentrating',
          'Understanding',
          'Following instructions',
          'Using hands',
          'Getting along with others',
        ],
      },
      {
        id: 'lifting_capacity',
        label: 'How much weight can you lift and carry?',
        type: 'text',
        path: 'functional_limitations.lifting_capacity',
        placeholder: 'e.g., 5 pounds, 10 pounds, 25 pounds',
      },
      {
        id: 'walking_distance',
        label: 'How far can you walk before needing to rest?',
        type: 'text',
        path: 'functional_limitations.walking_ability.distance_before_rest',
        placeholder: 'e.g., 1 block, 100 feet, 1 mile',
      },
      {
        id: 'rest_duration',
        label: 'How long do you need to rest before continuing?',
        type: 'text',
        path: 'functional_limitations.walking_ability.rest_duration',
        placeholder: 'e.g., 5 minutes, 15 minutes, 30 minutes',
      },
      {
        id: 'memory_issues',
        label: 'Do you have memory problems?',
        type: 'boolean',
        path: 'functional_limitations.memory_issues',
      },
      {
        id: 'concentration_issues',
        label: 'Do you have difficulty concentrating?',
        type: 'boolean',
        path: 'functional_limitations.concentration_issues',
      },
      {
        id: 'stress_handling',
        label: 'How do you handle stress?',
        type: 'textarea',
        path: 'functional_limitations.stress_handling',
        placeholder: 'Describe how you handle stressful situations...',
      },
      {
        id: 'routine_changes',
        label: 'How do you handle changes in routine?',
        type: 'textarea',
        path: 'functional_limitations.routine_changes',
        placeholder: 'Describe how you react to changes in your daily routine...',
      },
    ],
  },
];
