/**
 * Type definitions for SSA-3373 Function Report
 * Based on ssa_3373_schema.json
 */

export interface PersonalInformation {
  name: string;
  social_security_number: string;
  date_of_birth: string;
  daytime_phone: string;
  alternate_phone?: string;
}

export interface CareForOthers {
  cares_for: boolean;
  who?: string;
  type_of_care?: string;
}

export interface CareForPets {
  has_pets: boolean;
  type_of_care?: string;
}

export interface DailyActivities {
  wake_up_time: string;
  sleep_time: string;
  care_for_others: CareForOthers;
  care_for_pets: CareForPets;
}

export interface PersonalCareItem {
  needs_help: boolean;
  details?: string;
}

export interface Grooming {
  shaving: boolean;
  hair_care: boolean;
  details?: string;
}

export interface PersonalCare {
  bathing_dressing_care: PersonalCareItem;
  toileting: PersonalCareItem;
  feeding: PersonalCareItem;
  grooming: Grooming;
}

export interface PrepareMeals {
  frequency: string;
  types_of_meals: string;
  time_to_prepare: string;
  changes_before_illness: string;
}

export interface HouseAndYardWork {
  activities: string[];
  frequency: string;
  time_required: string;
  changes_before_illness: string;
}

export interface HouseholdActivities {
  prepare_meals: PrepareMeals;
  house_and_yard_work: HouseAndYardWork;
}

export interface Transportation {
  can_drive: boolean;
  drive_frequency?: string;
  reasons_not_drive?: string;
  use_public_transportation: boolean;
}

export interface Shopping {
  can_shop: boolean;
  what_shop_for?: string;
  frequency?: string;
  changes_before_illness?: string;
}

export interface MoneyManagement {
  can_handle_money: boolean;
  tasks: string[];
  changes_before_illness?: string;
}

export interface GoingPlaces {
  can_go_out_alone: boolean;
  go_out_frequency: string;
  places_go: string[];
  transportation: Transportation;
  shopping: Shopping;
  money_management: MoneyManagement;
}

export interface HobbiesAndInterests {
  current_hobbies: string[];
  frequency: string;
  changes_before_illness: string;
}

export interface SocialActivitiesData {
  activities: string[];
  frequency: string;
  changes_before_illness: string;
}

export interface TimeWithOthers {
  frequency: string;
  location: string;
  changes_before_illness: string;
}

export interface SocialActivities {
  hobbies_and_interests: HobbiesAndInterests;
  social_activities: SocialActivitiesData;
  time_with_others: TimeWithOthers;
}

export interface WalkingAbility {
  distance_before_rest: string;
  rest_duration: string;
}

export interface FunctionalLimitations {
  affected_abilities: string[];
  lifting_capacity: string;
  walking_ability: WalkingAbility;
  memory_issues: boolean;
  concentration_issues: boolean;
  instruction_following: string;
  relationship_with_authority: string;
  stress_handling: string;
  routine_changes: string;
}

export interface Medication {
  name: string;
  purpose: string;
  side_effects: string;
}

export interface Signature {
  name: string;
  date: string;
  relationship_to_claimant?: string;
}

export interface SSAFormData {
  personal_information?: PersonalInformation;
  daily_activities?: DailyActivities;
  personal_care?: PersonalCare;
  household_activities?: HouseholdActivities;
  going_places?: GoingPlaces;
  social_activities?: SocialActivities;
  functional_limitations?: FunctionalLimitations;
  medications?: Medication[];
  signature?: Signature;
}

// Question types for dynamic form generation
export type QuestionType =
  | 'text'
  | 'textarea'
  | 'boolean'
  | 'time'
  | 'date'
  | 'phone'
  | 'ssn'
  | 'array'
  | 'checklist';

export interface FormQuestion {
  id: string;
  label: string;
  type: QuestionType;
  path: string; // Path in SSAFormData object (e.g., "daily_activities.wake_up_time")
  required?: boolean;
  helpText?: string;
  placeholder?: string;
  conditional?: {
    dependsOn: string;
    value: any;
  };
  options?: string[]; // For checklist type
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    message?: string;
  };
}

export interface QuestionGroup {
  id: string;
  title: string;
  description: string;
  questions: FormQuestion[];
}
