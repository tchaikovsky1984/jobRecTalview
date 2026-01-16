import { GraphQLClient } from 'graphql-request';
import type { RequestOptions } from "graphql-request";
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  _text: { input: any; output: any; }
  float8: { input: any; output: any; }
  jsonb: { input: any; output: any; }
  timestamp: { input: any; output: any; }
  timestamptz: { input: any; output: any; }
  vector: { input: any; output: any; }
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']['input']>;
  _gt?: InputMaybe<Scalars['Int']['input']>;
  _gte?: InputMaybe<Scalars['Int']['input']>;
  _in?: InputMaybe<Array<Scalars['Int']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Int']['input']>;
  _lte?: InputMaybe<Scalars['Int']['input']>;
  _neq?: InputMaybe<Scalars['Int']['input']>;
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']['input']>;
  _gt?: InputMaybe<Scalars['String']['input']>;
  _gte?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']['input']>;
  _in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']['input']>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']['input']>;
  _lt?: InputMaybe<Scalars['String']['input']>;
  _lte?: InputMaybe<Scalars['String']['input']>;
  _neq?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']['input']>;
  _nin?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']['input']>;
};

/** Boolean expression to compare columns of type "_text". All fields are combined with logical 'AND'. */
export type _Text_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['_text']['input']>;
  _gt?: InputMaybe<Scalars['_text']['input']>;
  _gte?: InputMaybe<Scalars['_text']['input']>;
  _in?: InputMaybe<Array<Scalars['_text']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['_text']['input']>;
  _lte?: InputMaybe<Scalars['_text']['input']>;
  _neq?: InputMaybe<Scalars['_text']['input']>;
  _nin?: InputMaybe<Array<Scalars['_text']['input']>>;
};

/** ordering argument of a cursor */
export type Cursor_Ordering =
  /** ascending ordering of the cursor */
  | 'ASC'
  /** descending ordering of the cursor */
  | 'DESC';

/** Boolean expression to compare columns of type "float8". All fields are combined with logical 'AND'. */
export type Float8_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['float8']['input']>;
  _gt?: InputMaybe<Scalars['float8']['input']>;
  _gte?: InputMaybe<Scalars['float8']['input']>;
  _in?: InputMaybe<Array<Scalars['float8']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['float8']['input']>;
  _lte?: InputMaybe<Scalars['float8']['input']>;
  _neq?: InputMaybe<Scalars['float8']['input']>;
  _nin?: InputMaybe<Array<Scalars['float8']['input']>>;
};

/** columns and relationships of "interview_prep" */
export type Interview_Prep = {
  __typename?: 'interview_prep';
  created_at?: Maybe<Scalars['timestamp']['output']>;
  id: Scalars['Int']['output'];
  /** An object relationship */
  prep_for?: Maybe<Recommendation>;
  questions?: Maybe<Scalars['jsonb']['output']>;
  recommendation_id: Scalars['Int']['output'];
  tips?: Maybe<Scalars['_text']['output']>;
  topics?: Maybe<Scalars['_text']['output']>;
};


/** columns and relationships of "interview_prep" */
export type Interview_PrepQuestionsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "interview_prep" */
export type Interview_Prep_Aggregate = {
  __typename?: 'interview_prep_aggregate';
  aggregate?: Maybe<Interview_Prep_Aggregate_Fields>;
  nodes: Array<Interview_Prep>;
};

export type Interview_Prep_Aggregate_Bool_Exp = {
  count?: InputMaybe<Interview_Prep_Aggregate_Bool_Exp_Count>;
};

export type Interview_Prep_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Interview_Prep_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Interview_Prep_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "interview_prep" */
export type Interview_Prep_Aggregate_Fields = {
  __typename?: 'interview_prep_aggregate_fields';
  avg?: Maybe<Interview_Prep_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Interview_Prep_Max_Fields>;
  min?: Maybe<Interview_Prep_Min_Fields>;
  stddev?: Maybe<Interview_Prep_Stddev_Fields>;
  stddev_pop?: Maybe<Interview_Prep_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Interview_Prep_Stddev_Samp_Fields>;
  sum?: Maybe<Interview_Prep_Sum_Fields>;
  var_pop?: Maybe<Interview_Prep_Var_Pop_Fields>;
  var_samp?: Maybe<Interview_Prep_Var_Samp_Fields>;
  variance?: Maybe<Interview_Prep_Variance_Fields>;
};


/** aggregate fields of "interview_prep" */
export type Interview_Prep_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Interview_Prep_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "interview_prep" */
export type Interview_Prep_Aggregate_Order_By = {
  avg?: InputMaybe<Interview_Prep_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Interview_Prep_Max_Order_By>;
  min?: InputMaybe<Interview_Prep_Min_Order_By>;
  stddev?: InputMaybe<Interview_Prep_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Interview_Prep_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Interview_Prep_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Interview_Prep_Sum_Order_By>;
  var_pop?: InputMaybe<Interview_Prep_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Interview_Prep_Var_Samp_Order_By>;
  variance?: InputMaybe<Interview_Prep_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Interview_Prep_Append_Input = {
  questions?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "interview_prep" */
export type Interview_Prep_Arr_Rel_Insert_Input = {
  data: Array<Interview_Prep_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Interview_Prep_On_Conflict>;
};

/** aggregate avg on columns */
export type Interview_Prep_Avg_Fields = {
  __typename?: 'interview_prep_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
  recommendation_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "interview_prep" */
export type Interview_Prep_Avg_Order_By = {
  id?: InputMaybe<Order_By>;
  recommendation_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "interview_prep". All fields are combined with a logical 'AND'. */
export type Interview_Prep_Bool_Exp = {
  _and?: InputMaybe<Array<Interview_Prep_Bool_Exp>>;
  _not?: InputMaybe<Interview_Prep_Bool_Exp>;
  _or?: InputMaybe<Array<Interview_Prep_Bool_Exp>>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  prep_for?: InputMaybe<Recommendation_Bool_Exp>;
  questions?: InputMaybe<Jsonb_Comparison_Exp>;
  recommendation_id?: InputMaybe<Int_Comparison_Exp>;
  tips?: InputMaybe<_Text_Comparison_Exp>;
  topics?: InputMaybe<_Text_Comparison_Exp>;
};

/** unique or primary key constraints on table "interview_prep" */
export type Interview_Prep_Constraint =
  /** unique or primary key constraint on columns "id" */
  | 'interview_prep_pkey'
  /** unique or primary key constraint on columns "recommendation_id" */
  | 'interview_prep_recommendation_id_key';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Interview_Prep_Delete_At_Path_Input = {
  questions?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Interview_Prep_Delete_Elem_Input = {
  questions?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Interview_Prep_Delete_Key_Input = {
  questions?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "interview_prep" */
export type Interview_Prep_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  recommendation_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "interview_prep" */
export type Interview_Prep_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  prep_for?: InputMaybe<Recommendation_Obj_Rel_Insert_Input>;
  questions?: InputMaybe<Scalars['jsonb']['input']>;
  recommendation_id?: InputMaybe<Scalars['Int']['input']>;
  tips?: InputMaybe<Scalars['_text']['input']>;
  topics?: InputMaybe<Scalars['_text']['input']>;
};

/** aggregate max on columns */
export type Interview_Prep_Max_Fields = {
  __typename?: 'interview_prep_max_fields';
  created_at?: Maybe<Scalars['timestamp']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  recommendation_id?: Maybe<Scalars['Int']['output']>;
};

/** order by max() on columns of table "interview_prep" */
export type Interview_Prep_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  recommendation_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Interview_Prep_Min_Fields = {
  __typename?: 'interview_prep_min_fields';
  created_at?: Maybe<Scalars['timestamp']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  recommendation_id?: Maybe<Scalars['Int']['output']>;
};

/** order by min() on columns of table "interview_prep" */
export type Interview_Prep_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  recommendation_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "interview_prep" */
export type Interview_Prep_Mutation_Response = {
  __typename?: 'interview_prep_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Interview_Prep>;
};

/** on_conflict condition type for table "interview_prep" */
export type Interview_Prep_On_Conflict = {
  constraint: Interview_Prep_Constraint;
  update_columns?: Array<Interview_Prep_Update_Column>;
  where?: InputMaybe<Interview_Prep_Bool_Exp>;
};

/** Ordering options when selecting data from "interview_prep". */
export type Interview_Prep_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  prep_for?: InputMaybe<Recommendation_Order_By>;
  questions?: InputMaybe<Order_By>;
  recommendation_id?: InputMaybe<Order_By>;
  tips?: InputMaybe<Order_By>;
  topics?: InputMaybe<Order_By>;
};

/** primary key columns input for table: interview_prep */
export type Interview_Prep_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Interview_Prep_Prepend_Input = {
  questions?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "interview_prep" */
export type Interview_Prep_Select_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'id'
  /** column name */
  | 'questions'
  /** column name */
  | 'recommendation_id'
  /** column name */
  | 'tips'
  /** column name */
  | 'topics';

/** input type for updating data in table "interview_prep" */
export type Interview_Prep_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  questions?: InputMaybe<Scalars['jsonb']['input']>;
  recommendation_id?: InputMaybe<Scalars['Int']['input']>;
  tips?: InputMaybe<Scalars['_text']['input']>;
  topics?: InputMaybe<Scalars['_text']['input']>;
};

/** aggregate stddev on columns */
export type Interview_Prep_Stddev_Fields = {
  __typename?: 'interview_prep_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
  recommendation_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "interview_prep" */
export type Interview_Prep_Stddev_Order_By = {
  id?: InputMaybe<Order_By>;
  recommendation_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Interview_Prep_Stddev_Pop_Fields = {
  __typename?: 'interview_prep_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  recommendation_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "interview_prep" */
export type Interview_Prep_Stddev_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  recommendation_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Interview_Prep_Stddev_Samp_Fields = {
  __typename?: 'interview_prep_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  recommendation_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "interview_prep" */
export type Interview_Prep_Stddev_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  recommendation_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "interview_prep" */
export type Interview_Prep_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Interview_Prep_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Interview_Prep_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  questions?: InputMaybe<Scalars['jsonb']['input']>;
  recommendation_id?: InputMaybe<Scalars['Int']['input']>;
  tips?: InputMaybe<Scalars['_text']['input']>;
  topics?: InputMaybe<Scalars['_text']['input']>;
};

/** aggregate sum on columns */
export type Interview_Prep_Sum_Fields = {
  __typename?: 'interview_prep_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
  recommendation_id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "interview_prep" */
export type Interview_Prep_Sum_Order_By = {
  id?: InputMaybe<Order_By>;
  recommendation_id?: InputMaybe<Order_By>;
};

/** update columns of table "interview_prep" */
export type Interview_Prep_Update_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'id'
  /** column name */
  | 'questions'
  /** column name */
  | 'recommendation_id'
  /** column name */
  | 'tips'
  /** column name */
  | 'topics';

export type Interview_Prep_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Interview_Prep_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Interview_Prep_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Interview_Prep_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Interview_Prep_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Interview_Prep_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Interview_Prep_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Interview_Prep_Set_Input>;
  /** filter the rows which have to be updated */
  where: Interview_Prep_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Interview_Prep_Var_Pop_Fields = {
  __typename?: 'interview_prep_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  recommendation_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "interview_prep" */
export type Interview_Prep_Var_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  recommendation_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Interview_Prep_Var_Samp_Fields = {
  __typename?: 'interview_prep_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  recommendation_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "interview_prep" */
export type Interview_Prep_Var_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  recommendation_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Interview_Prep_Variance_Fields = {
  __typename?: 'interview_prep_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
  recommendation_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "interview_prep" */
export type Interview_Prep_Variance_Order_By = {
  id?: InputMaybe<Order_By>;
  recommendation_id?: InputMaybe<Order_By>;
};

/** columns and relationships of "job" */
export type Job = {
  __typename?: 'job';
  company?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  embedding?: Maybe<Scalars['vector']['output']>;
  experience?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  location?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  recommendations: Array<Recommendation>;
  /** An aggregate relationship */
  recommendations_aggregate: Recommendation_Aggregate;
  ref_date: Scalars['timestamptz']['output'];
  search_pref_area?: Maybe<Scalars['String']['output']>;
  search_pref_country?: Maybe<Scalars['String']['output']>;
  search_title?: Maybe<Scalars['String']['output']>;
  skills?: Maybe<Scalars['_text']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};


/** columns and relationships of "job" */
export type JobRecommendationsArgs = {
  distinct_on?: InputMaybe<Array<Recommendation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Recommendation_Order_By>>;
  where?: InputMaybe<Recommendation_Bool_Exp>;
};


/** columns and relationships of "job" */
export type JobRecommendations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Recommendation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Recommendation_Order_By>>;
  where?: InputMaybe<Recommendation_Bool_Exp>;
};

/** aggregated selection of "job" */
export type Job_Aggregate = {
  __typename?: 'job_aggregate';
  aggregate?: Maybe<Job_Aggregate_Fields>;
  nodes: Array<Job>;
};

/** aggregate fields of "job" */
export type Job_Aggregate_Fields = {
  __typename?: 'job_aggregate_fields';
  avg?: Maybe<Job_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Job_Max_Fields>;
  min?: Maybe<Job_Min_Fields>;
  stddev?: Maybe<Job_Stddev_Fields>;
  stddev_pop?: Maybe<Job_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Job_Stddev_Samp_Fields>;
  sum?: Maybe<Job_Sum_Fields>;
  var_pop?: Maybe<Job_Var_Pop_Fields>;
  var_samp?: Maybe<Job_Var_Samp_Fields>;
  variance?: Maybe<Job_Variance_Fields>;
};


/** aggregate fields of "job" */
export type Job_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Job_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Job_Avg_Fields = {
  __typename?: 'job_avg_fields';
  experience?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "job". All fields are combined with a logical 'AND'. */
export type Job_Bool_Exp = {
  _and?: InputMaybe<Array<Job_Bool_Exp>>;
  _not?: InputMaybe<Job_Bool_Exp>;
  _or?: InputMaybe<Array<Job_Bool_Exp>>;
  company?: InputMaybe<String_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  embedding?: InputMaybe<Vector_Comparison_Exp>;
  experience?: InputMaybe<Int_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  location?: InputMaybe<String_Comparison_Exp>;
  recommendations?: InputMaybe<Recommendation_Bool_Exp>;
  recommendations_aggregate?: InputMaybe<Recommendation_Aggregate_Bool_Exp>;
  ref_date?: InputMaybe<Timestamptz_Comparison_Exp>;
  search_pref_area?: InputMaybe<String_Comparison_Exp>;
  search_pref_country?: InputMaybe<String_Comparison_Exp>;
  search_title?: InputMaybe<String_Comparison_Exp>;
  skills?: InputMaybe<_Text_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  url?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "job" */
export type Job_Constraint =
  /** unique or primary key constraint on columns "id" */
  | 'job_pkey'
  /** unique or primary key constraint on columns "url" */
  | 'job_url_key';

/** input type for incrementing numeric columns in table "job" */
export type Job_Inc_Input = {
  experience?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "job" */
export type Job_Insert_Input = {
  company?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  embedding?: InputMaybe<Scalars['vector']['input']>;
  experience?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  recommendations?: InputMaybe<Recommendation_Arr_Rel_Insert_Input>;
  ref_date?: InputMaybe<Scalars['timestamptz']['input']>;
  search_pref_area?: InputMaybe<Scalars['String']['input']>;
  search_pref_country?: InputMaybe<Scalars['String']['input']>;
  search_title?: InputMaybe<Scalars['String']['input']>;
  skills?: InputMaybe<Scalars['_text']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Job_Max_Fields = {
  __typename?: 'job_max_fields';
  company?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  experience?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  ref_date?: Maybe<Scalars['timestamptz']['output']>;
  search_pref_area?: Maybe<Scalars['String']['output']>;
  search_pref_country?: Maybe<Scalars['String']['output']>;
  search_title?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Job_Min_Fields = {
  __typename?: 'job_min_fields';
  company?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  experience?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  ref_date?: Maybe<Scalars['timestamptz']['output']>;
  search_pref_area?: Maybe<Scalars['String']['output']>;
  search_pref_country?: Maybe<Scalars['String']['output']>;
  search_title?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "job" */
export type Job_Mutation_Response = {
  __typename?: 'job_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Job>;
};

/** input type for inserting object relation for remote table "job" */
export type Job_Obj_Rel_Insert_Input = {
  data: Job_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Job_On_Conflict>;
};

/** on_conflict condition type for table "job" */
export type Job_On_Conflict = {
  constraint: Job_Constraint;
  update_columns?: Array<Job_Update_Column>;
  where?: InputMaybe<Job_Bool_Exp>;
};

/** Ordering options when selecting data from "job". */
export type Job_Order_By = {
  company?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  embedding?: InputMaybe<Order_By>;
  experience?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  location?: InputMaybe<Order_By>;
  recommendations_aggregate?: InputMaybe<Recommendation_Aggregate_Order_By>;
  ref_date?: InputMaybe<Order_By>;
  search_pref_area?: InputMaybe<Order_By>;
  search_pref_country?: InputMaybe<Order_By>;
  search_title?: InputMaybe<Order_By>;
  skills?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  url?: InputMaybe<Order_By>;
};

/** primary key columns input for table: job */
export type Job_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "job" */
export type Job_Select_Column =
  /** column name */
  | 'company'
  /** column name */
  | 'description'
  /** column name */
  | 'embedding'
  /** column name */
  | 'experience'
  /** column name */
  | 'id'
  /** column name */
  | 'location'
  /** column name */
  | 'ref_date'
  /** column name */
  | 'search_pref_area'
  /** column name */
  | 'search_pref_country'
  /** column name */
  | 'search_title'
  /** column name */
  | 'skills'
  /** column name */
  | 'title'
  /** column name */
  | 'url';

/** input type for updating data in table "job" */
export type Job_Set_Input = {
  company?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  embedding?: InputMaybe<Scalars['vector']['input']>;
  experience?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  ref_date?: InputMaybe<Scalars['timestamptz']['input']>;
  search_pref_area?: InputMaybe<Scalars['String']['input']>;
  search_pref_country?: InputMaybe<Scalars['String']['input']>;
  search_title?: InputMaybe<Scalars['String']['input']>;
  skills?: InputMaybe<Scalars['_text']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Job_Stddev_Fields = {
  __typename?: 'job_stddev_fields';
  experience?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Job_Stddev_Pop_Fields = {
  __typename?: 'job_stddev_pop_fields';
  experience?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Job_Stddev_Samp_Fields = {
  __typename?: 'job_stddev_samp_fields';
  experience?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "job" */
export type Job_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Job_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Job_Stream_Cursor_Value_Input = {
  company?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  embedding?: InputMaybe<Scalars['vector']['input']>;
  experience?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  ref_date?: InputMaybe<Scalars['timestamptz']['input']>;
  search_pref_area?: InputMaybe<Scalars['String']['input']>;
  search_pref_country?: InputMaybe<Scalars['String']['input']>;
  search_title?: InputMaybe<Scalars['String']['input']>;
  skills?: InputMaybe<Scalars['_text']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Job_Sum_Fields = {
  __typename?: 'job_sum_fields';
  experience?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "job" */
export type Job_Update_Column =
  /** column name */
  | 'company'
  /** column name */
  | 'description'
  /** column name */
  | 'embedding'
  /** column name */
  | 'experience'
  /** column name */
  | 'id'
  /** column name */
  | 'location'
  /** column name */
  | 'ref_date'
  /** column name */
  | 'search_pref_area'
  /** column name */
  | 'search_pref_country'
  /** column name */
  | 'search_title'
  /** column name */
  | 'skills'
  /** column name */
  | 'title'
  /** column name */
  | 'url';

export type Job_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Job_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Job_Set_Input>;
  /** filter the rows which have to be updated */
  where: Job_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Job_Var_Pop_Fields = {
  __typename?: 'job_var_pop_fields';
  experience?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Job_Var_Samp_Fields = {
  __typename?: 'job_var_samp_fields';
  experience?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Job_Variance_Fields = {
  __typename?: 'job_variance_fields';
  experience?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

export type Jsonb_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  _cast?: InputMaybe<Jsonb_Cast_Exp>;
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']['input']>;
  _eq?: InputMaybe<Scalars['jsonb']['input']>;
  _gt?: InputMaybe<Scalars['jsonb']['input']>;
  _gte?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']['input']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']['input']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']['input']>>;
  _in?: InputMaybe<Array<Scalars['jsonb']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['jsonb']['input']>;
  _lte?: InputMaybe<Scalars['jsonb']['input']>;
  _neq?: InputMaybe<Scalars['jsonb']['input']>;
  _nin?: InputMaybe<Array<Scalars['jsonb']['input']>>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "interview_prep" */
  delete_interview_prep?: Maybe<Interview_Prep_Mutation_Response>;
  /** delete single row from the table: "interview_prep" */
  delete_interview_prep_by_pk?: Maybe<Interview_Prep>;
  /** delete data from the table: "job" */
  delete_job?: Maybe<Job_Mutation_Response>;
  /** delete single row from the table: "job" */
  delete_job_by_pk?: Maybe<Job>;
  /** delete data from the table: "recommendation" */
  delete_recommendation?: Maybe<Recommendation_Mutation_Response>;
  /** delete single row from the table: "recommendation" */
  delete_recommendation_by_pk?: Maybe<Recommendation>;
  /** delete data from the table: "resume" */
  delete_resume?: Maybe<Resume_Mutation_Response>;
  /** delete single row from the table: "resume" */
  delete_resume_by_pk?: Maybe<Resume>;
  /** delete data from the table: "user" */
  delete_user?: Maybe<User_Mutation_Response>;
  /** delete single row from the table: "user" */
  delete_user_by_pk?: Maybe<User>;
  /** insert data into the table: "interview_prep" */
  insert_interview_prep?: Maybe<Interview_Prep_Mutation_Response>;
  /** insert a single row into the table: "interview_prep" */
  insert_interview_prep_one?: Maybe<Interview_Prep>;
  /** insert data into the table: "job" */
  insert_job?: Maybe<Job_Mutation_Response>;
  /** insert a single row into the table: "job" */
  insert_job_one?: Maybe<Job>;
  /** insert data into the table: "recommendation" */
  insert_recommendation?: Maybe<Recommendation_Mutation_Response>;
  /** insert a single row into the table: "recommendation" */
  insert_recommendation_one?: Maybe<Recommendation>;
  /** insert data into the table: "resume" */
  insert_resume?: Maybe<Resume_Mutation_Response>;
  /** insert a single row into the table: "resume" */
  insert_resume_one?: Maybe<Resume>;
  /** insert data into the table: "user" */
  insert_user?: Maybe<User_Mutation_Response>;
  /** insert a single row into the table: "user" */
  insert_user_one?: Maybe<User>;
  /** update data of the table: "interview_prep" */
  update_interview_prep?: Maybe<Interview_Prep_Mutation_Response>;
  /** update single row of the table: "interview_prep" */
  update_interview_prep_by_pk?: Maybe<Interview_Prep>;
  /** update multiples rows of table: "interview_prep" */
  update_interview_prep_many?: Maybe<Array<Maybe<Interview_Prep_Mutation_Response>>>;
  /** update data of the table: "job" */
  update_job?: Maybe<Job_Mutation_Response>;
  /** update single row of the table: "job" */
  update_job_by_pk?: Maybe<Job>;
  /** update multiples rows of table: "job" */
  update_job_many?: Maybe<Array<Maybe<Job_Mutation_Response>>>;
  /** update data of the table: "recommendation" */
  update_recommendation?: Maybe<Recommendation_Mutation_Response>;
  /** update single row of the table: "recommendation" */
  update_recommendation_by_pk?: Maybe<Recommendation>;
  /** update multiples rows of table: "recommendation" */
  update_recommendation_many?: Maybe<Array<Maybe<Recommendation_Mutation_Response>>>;
  /** update data of the table: "resume" */
  update_resume?: Maybe<Resume_Mutation_Response>;
  /** update single row of the table: "resume" */
  update_resume_by_pk?: Maybe<Resume>;
  /** update multiples rows of table: "resume" */
  update_resume_many?: Maybe<Array<Maybe<Resume_Mutation_Response>>>;
  /** update data of the table: "user" */
  update_user?: Maybe<User_Mutation_Response>;
  /** update single row of the table: "user" */
  update_user_by_pk?: Maybe<User>;
  /** update multiples rows of table: "user" */
  update_user_many?: Maybe<Array<Maybe<User_Mutation_Response>>>;
};


/** mutation root */
export type Mutation_RootDelete_Interview_PrepArgs = {
  where: Interview_Prep_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Interview_Prep_By_PkArgs = {
  id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_JobArgs = {
  where: Job_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Job_By_PkArgs = {
  id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_RecommendationArgs = {
  where: Recommendation_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Recommendation_By_PkArgs = {
  id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_ResumeArgs = {
  where: Resume_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Resume_By_PkArgs = {
  id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_UserArgs = {
  where: User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_User_By_PkArgs = {
  id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootInsert_Interview_PrepArgs = {
  objects: Array<Interview_Prep_Insert_Input>;
  on_conflict?: InputMaybe<Interview_Prep_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Interview_Prep_OneArgs = {
  object: Interview_Prep_Insert_Input;
  on_conflict?: InputMaybe<Interview_Prep_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_JobArgs = {
  objects: Array<Job_Insert_Input>;
  on_conflict?: InputMaybe<Job_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Job_OneArgs = {
  object: Job_Insert_Input;
  on_conflict?: InputMaybe<Job_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_RecommendationArgs = {
  objects: Array<Recommendation_Insert_Input>;
  on_conflict?: InputMaybe<Recommendation_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Recommendation_OneArgs = {
  object: Recommendation_Insert_Input;
  on_conflict?: InputMaybe<Recommendation_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_ResumeArgs = {
  objects: Array<Resume_Insert_Input>;
  on_conflict?: InputMaybe<Resume_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Resume_OneArgs = {
  object: Resume_Insert_Input;
  on_conflict?: InputMaybe<Resume_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_UserArgs = {
  objects: Array<User_Insert_Input>;
  on_conflict?: InputMaybe<User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_OneArgs = {
  object: User_Insert_Input;
  on_conflict?: InputMaybe<User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_Interview_PrepArgs = {
  _append?: InputMaybe<Interview_Prep_Append_Input>;
  _delete_at_path?: InputMaybe<Interview_Prep_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Interview_Prep_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Interview_Prep_Delete_Key_Input>;
  _inc?: InputMaybe<Interview_Prep_Inc_Input>;
  _prepend?: InputMaybe<Interview_Prep_Prepend_Input>;
  _set?: InputMaybe<Interview_Prep_Set_Input>;
  where: Interview_Prep_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Interview_Prep_By_PkArgs = {
  _append?: InputMaybe<Interview_Prep_Append_Input>;
  _delete_at_path?: InputMaybe<Interview_Prep_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Interview_Prep_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Interview_Prep_Delete_Key_Input>;
  _inc?: InputMaybe<Interview_Prep_Inc_Input>;
  _prepend?: InputMaybe<Interview_Prep_Prepend_Input>;
  _set?: InputMaybe<Interview_Prep_Set_Input>;
  pk_columns: Interview_Prep_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Interview_Prep_ManyArgs = {
  updates: Array<Interview_Prep_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_JobArgs = {
  _inc?: InputMaybe<Job_Inc_Input>;
  _set?: InputMaybe<Job_Set_Input>;
  where: Job_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Job_By_PkArgs = {
  _inc?: InputMaybe<Job_Inc_Input>;
  _set?: InputMaybe<Job_Set_Input>;
  pk_columns: Job_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Job_ManyArgs = {
  updates: Array<Job_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_RecommendationArgs = {
  _inc?: InputMaybe<Recommendation_Inc_Input>;
  _set?: InputMaybe<Recommendation_Set_Input>;
  where: Recommendation_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Recommendation_By_PkArgs = {
  _inc?: InputMaybe<Recommendation_Inc_Input>;
  _set?: InputMaybe<Recommendation_Set_Input>;
  pk_columns: Recommendation_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Recommendation_ManyArgs = {
  updates: Array<Recommendation_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_ResumeArgs = {
  _inc?: InputMaybe<Resume_Inc_Input>;
  _set?: InputMaybe<Resume_Set_Input>;
  where: Resume_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Resume_By_PkArgs = {
  _inc?: InputMaybe<Resume_Inc_Input>;
  _set?: InputMaybe<Resume_Set_Input>;
  pk_columns: Resume_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Resume_ManyArgs = {
  updates: Array<Resume_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_UserArgs = {
  _inc?: InputMaybe<User_Inc_Input>;
  _set?: InputMaybe<User_Set_Input>;
  where: User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_User_By_PkArgs = {
  _inc?: InputMaybe<User_Inc_Input>;
  _set?: InputMaybe<User_Set_Input>;
  pk_columns: User_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_User_ManyArgs = {
  updates: Array<User_Updates>;
};

/** column ordering options */
export type Order_By =
  /** in ascending order, nulls last */
  | 'asc'
  /** in ascending order, nulls first */
  | 'asc_nulls_first'
  /** in ascending order, nulls last */
  | 'asc_nulls_last'
  /** in descending order, nulls first */
  | 'desc'
  /** in descending order, nulls first */
  | 'desc_nulls_first'
  /** in descending order, nulls last */
  | 'desc_nulls_last';

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "interview_prep" */
  interview_prep: Array<Interview_Prep>;
  /** fetch aggregated fields from the table: "interview_prep" */
  interview_prep_aggregate: Interview_Prep_Aggregate;
  /** fetch data from the table: "interview_prep" using primary key columns */
  interview_prep_by_pk?: Maybe<Interview_Prep>;
  /** fetch data from the table: "job" */
  job: Array<Job>;
  /** fetch aggregated fields from the table: "job" */
  job_aggregate: Job_Aggregate;
  /** fetch data from the table: "job" using primary key columns */
  job_by_pk?: Maybe<Job>;
  /** fetch data from the table: "recommendation" */
  recommendation: Array<Recommendation>;
  /** fetch aggregated fields from the table: "recommendation" */
  recommendation_aggregate: Recommendation_Aggregate;
  /** fetch data from the table: "recommendation" using primary key columns */
  recommendation_by_pk?: Maybe<Recommendation>;
  /** fetch data from the table: "resume" */
  resume: Array<Resume>;
  /** fetch aggregated fields from the table: "resume" */
  resume_aggregate: Resume_Aggregate;
  /** fetch data from the table: "resume" using primary key columns */
  resume_by_pk?: Maybe<Resume>;
  /** fetch data from the table: "user" */
  user: Array<User>;
  /** fetch aggregated fields from the table: "user" */
  user_aggregate: User_Aggregate;
  /** fetch data from the table: "user" using primary key columns */
  user_by_pk?: Maybe<User>;
};


export type Query_RootInterview_PrepArgs = {
  distinct_on?: InputMaybe<Array<Interview_Prep_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Interview_Prep_Order_By>>;
  where?: InputMaybe<Interview_Prep_Bool_Exp>;
};


export type Query_RootInterview_Prep_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Interview_Prep_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Interview_Prep_Order_By>>;
  where?: InputMaybe<Interview_Prep_Bool_Exp>;
};


export type Query_RootInterview_Prep_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Query_RootJobArgs = {
  distinct_on?: InputMaybe<Array<Job_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Job_Order_By>>;
  where?: InputMaybe<Job_Bool_Exp>;
};


export type Query_RootJob_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Job_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Job_Order_By>>;
  where?: InputMaybe<Job_Bool_Exp>;
};


export type Query_RootJob_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Query_RootRecommendationArgs = {
  distinct_on?: InputMaybe<Array<Recommendation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Recommendation_Order_By>>;
  where?: InputMaybe<Recommendation_Bool_Exp>;
};


export type Query_RootRecommendation_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Recommendation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Recommendation_Order_By>>;
  where?: InputMaybe<Recommendation_Bool_Exp>;
};


export type Query_RootRecommendation_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Query_RootResumeArgs = {
  distinct_on?: InputMaybe<Array<Resume_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Resume_Order_By>>;
  where?: InputMaybe<Resume_Bool_Exp>;
};


export type Query_RootResume_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Resume_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Resume_Order_By>>;
  where?: InputMaybe<Resume_Bool_Exp>;
};


export type Query_RootResume_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Query_RootUserArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Query_RootUser_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Query_RootUser_By_PkArgs = {
  id: Scalars['Int']['input'];
};

/** columns and relationships of "recommendation" */
export type Recommendation = {
  __typename?: 'recommendation';
  analysis_date: Scalars['timestamptz']['output'];
  id: Scalars['Int']['output'];
  /** An object relationship */
  job?: Maybe<Job>;
  job_id: Scalars['Int']['output'];
  /** An array relationship */
  prep: Array<Interview_Prep>;
  /** An aggregate relationship */
  prep_aggregate: Interview_Prep_Aggregate;
  reasoning?: Maybe<Scalars['String']['output']>;
  res_id: Scalars['Int']['output'];
  /** An object relationship */
  resume?: Maybe<Resume>;
  score: Scalars['float8']['output'];
  skill_matches?: Maybe<Scalars['_text']['output']>;
  skill_misses?: Maybe<Scalars['_text']['output']>;
};


/** columns and relationships of "recommendation" */
export type RecommendationPrepArgs = {
  distinct_on?: InputMaybe<Array<Interview_Prep_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Interview_Prep_Order_By>>;
  where?: InputMaybe<Interview_Prep_Bool_Exp>;
};


/** columns and relationships of "recommendation" */
export type RecommendationPrep_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Interview_Prep_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Interview_Prep_Order_By>>;
  where?: InputMaybe<Interview_Prep_Bool_Exp>;
};

/** aggregated selection of "recommendation" */
export type Recommendation_Aggregate = {
  __typename?: 'recommendation_aggregate';
  aggregate?: Maybe<Recommendation_Aggregate_Fields>;
  nodes: Array<Recommendation>;
};

export type Recommendation_Aggregate_Bool_Exp = {
  avg?: InputMaybe<Recommendation_Aggregate_Bool_Exp_Avg>;
  corr?: InputMaybe<Recommendation_Aggregate_Bool_Exp_Corr>;
  count?: InputMaybe<Recommendation_Aggregate_Bool_Exp_Count>;
  covar_samp?: InputMaybe<Recommendation_Aggregate_Bool_Exp_Covar_Samp>;
  max?: InputMaybe<Recommendation_Aggregate_Bool_Exp_Max>;
  min?: InputMaybe<Recommendation_Aggregate_Bool_Exp_Min>;
  stddev_samp?: InputMaybe<Recommendation_Aggregate_Bool_Exp_Stddev_Samp>;
  sum?: InputMaybe<Recommendation_Aggregate_Bool_Exp_Sum>;
  var_samp?: InputMaybe<Recommendation_Aggregate_Bool_Exp_Var_Samp>;
};

export type Recommendation_Aggregate_Bool_Exp_Avg = {
  arguments: Recommendation_Select_Column_Recommendation_Aggregate_Bool_Exp_Avg_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Recommendation_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

export type Recommendation_Aggregate_Bool_Exp_Corr = {
  arguments: Recommendation_Aggregate_Bool_Exp_Corr_Arguments;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Recommendation_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

export type Recommendation_Aggregate_Bool_Exp_Corr_Arguments = {
  X: Recommendation_Select_Column_Recommendation_Aggregate_Bool_Exp_Corr_Arguments_Columns;
  Y: Recommendation_Select_Column_Recommendation_Aggregate_Bool_Exp_Corr_Arguments_Columns;
};

export type Recommendation_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Recommendation_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Recommendation_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

export type Recommendation_Aggregate_Bool_Exp_Covar_Samp = {
  arguments: Recommendation_Aggregate_Bool_Exp_Covar_Samp_Arguments;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Recommendation_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

export type Recommendation_Aggregate_Bool_Exp_Covar_Samp_Arguments = {
  X: Recommendation_Select_Column_Recommendation_Aggregate_Bool_Exp_Covar_Samp_Arguments_Columns;
  Y: Recommendation_Select_Column_Recommendation_Aggregate_Bool_Exp_Covar_Samp_Arguments_Columns;
};

export type Recommendation_Aggregate_Bool_Exp_Max = {
  arguments: Recommendation_Select_Column_Recommendation_Aggregate_Bool_Exp_Max_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Recommendation_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

export type Recommendation_Aggregate_Bool_Exp_Min = {
  arguments: Recommendation_Select_Column_Recommendation_Aggregate_Bool_Exp_Min_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Recommendation_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

export type Recommendation_Aggregate_Bool_Exp_Stddev_Samp = {
  arguments: Recommendation_Select_Column_Recommendation_Aggregate_Bool_Exp_Stddev_Samp_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Recommendation_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

export type Recommendation_Aggregate_Bool_Exp_Sum = {
  arguments: Recommendation_Select_Column_Recommendation_Aggregate_Bool_Exp_Sum_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Recommendation_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

export type Recommendation_Aggregate_Bool_Exp_Var_Samp = {
  arguments: Recommendation_Select_Column_Recommendation_Aggregate_Bool_Exp_Var_Samp_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Recommendation_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

/** aggregate fields of "recommendation" */
export type Recommendation_Aggregate_Fields = {
  __typename?: 'recommendation_aggregate_fields';
  avg?: Maybe<Recommendation_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Recommendation_Max_Fields>;
  min?: Maybe<Recommendation_Min_Fields>;
  stddev?: Maybe<Recommendation_Stddev_Fields>;
  stddev_pop?: Maybe<Recommendation_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Recommendation_Stddev_Samp_Fields>;
  sum?: Maybe<Recommendation_Sum_Fields>;
  var_pop?: Maybe<Recommendation_Var_Pop_Fields>;
  var_samp?: Maybe<Recommendation_Var_Samp_Fields>;
  variance?: Maybe<Recommendation_Variance_Fields>;
};


/** aggregate fields of "recommendation" */
export type Recommendation_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Recommendation_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "recommendation" */
export type Recommendation_Aggregate_Order_By = {
  avg?: InputMaybe<Recommendation_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Recommendation_Max_Order_By>;
  min?: InputMaybe<Recommendation_Min_Order_By>;
  stddev?: InputMaybe<Recommendation_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Recommendation_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Recommendation_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Recommendation_Sum_Order_By>;
  var_pop?: InputMaybe<Recommendation_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Recommendation_Var_Samp_Order_By>;
  variance?: InputMaybe<Recommendation_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "recommendation" */
export type Recommendation_Arr_Rel_Insert_Input = {
  data: Array<Recommendation_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Recommendation_On_Conflict>;
};

/** aggregate avg on columns */
export type Recommendation_Avg_Fields = {
  __typename?: 'recommendation_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
  job_id?: Maybe<Scalars['Float']['output']>;
  res_id?: Maybe<Scalars['Float']['output']>;
  score?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "recommendation" */
export type Recommendation_Avg_Order_By = {
  id?: InputMaybe<Order_By>;
  job_id?: InputMaybe<Order_By>;
  res_id?: InputMaybe<Order_By>;
  score?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "recommendation". All fields are combined with a logical 'AND'. */
export type Recommendation_Bool_Exp = {
  _and?: InputMaybe<Array<Recommendation_Bool_Exp>>;
  _not?: InputMaybe<Recommendation_Bool_Exp>;
  _or?: InputMaybe<Array<Recommendation_Bool_Exp>>;
  analysis_date?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  job?: InputMaybe<Job_Bool_Exp>;
  job_id?: InputMaybe<Int_Comparison_Exp>;
  prep?: InputMaybe<Interview_Prep_Bool_Exp>;
  prep_aggregate?: InputMaybe<Interview_Prep_Aggregate_Bool_Exp>;
  reasoning?: InputMaybe<String_Comparison_Exp>;
  res_id?: InputMaybe<Int_Comparison_Exp>;
  resume?: InputMaybe<Resume_Bool_Exp>;
  score?: InputMaybe<Float8_Comparison_Exp>;
  skill_matches?: InputMaybe<_Text_Comparison_Exp>;
  skill_misses?: InputMaybe<_Text_Comparison_Exp>;
};

/** unique or primary key constraints on table "recommendation" */
export type Recommendation_Constraint =
  /** unique or primary key constraint on columns "id" */
  | 'recommendation_pkey'
  /** unique or primary key constraint on columns "job_id", "res_id" */
  | 'recommendation_res_id_job_id_key';

/** input type for incrementing numeric columns in table "recommendation" */
export type Recommendation_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  job_id?: InputMaybe<Scalars['Int']['input']>;
  res_id?: InputMaybe<Scalars['Int']['input']>;
  score?: InputMaybe<Scalars['float8']['input']>;
};

/** input type for inserting data into table "recommendation" */
export type Recommendation_Insert_Input = {
  analysis_date?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  job?: InputMaybe<Job_Obj_Rel_Insert_Input>;
  job_id?: InputMaybe<Scalars['Int']['input']>;
  prep?: InputMaybe<Interview_Prep_Arr_Rel_Insert_Input>;
  reasoning?: InputMaybe<Scalars['String']['input']>;
  res_id?: InputMaybe<Scalars['Int']['input']>;
  resume?: InputMaybe<Resume_Obj_Rel_Insert_Input>;
  score?: InputMaybe<Scalars['float8']['input']>;
  skill_matches?: InputMaybe<Scalars['_text']['input']>;
  skill_misses?: InputMaybe<Scalars['_text']['input']>;
};

/** aggregate max on columns */
export type Recommendation_Max_Fields = {
  __typename?: 'recommendation_max_fields';
  analysis_date?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  job_id?: Maybe<Scalars['Int']['output']>;
  reasoning?: Maybe<Scalars['String']['output']>;
  res_id?: Maybe<Scalars['Int']['output']>;
  score?: Maybe<Scalars['float8']['output']>;
};

/** order by max() on columns of table "recommendation" */
export type Recommendation_Max_Order_By = {
  analysis_date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  job_id?: InputMaybe<Order_By>;
  reasoning?: InputMaybe<Order_By>;
  res_id?: InputMaybe<Order_By>;
  score?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Recommendation_Min_Fields = {
  __typename?: 'recommendation_min_fields';
  analysis_date?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  job_id?: Maybe<Scalars['Int']['output']>;
  reasoning?: Maybe<Scalars['String']['output']>;
  res_id?: Maybe<Scalars['Int']['output']>;
  score?: Maybe<Scalars['float8']['output']>;
};

/** order by min() on columns of table "recommendation" */
export type Recommendation_Min_Order_By = {
  analysis_date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  job_id?: InputMaybe<Order_By>;
  reasoning?: InputMaybe<Order_By>;
  res_id?: InputMaybe<Order_By>;
  score?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "recommendation" */
export type Recommendation_Mutation_Response = {
  __typename?: 'recommendation_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Recommendation>;
};

/** input type for inserting object relation for remote table "recommendation" */
export type Recommendation_Obj_Rel_Insert_Input = {
  data: Recommendation_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Recommendation_On_Conflict>;
};

/** on_conflict condition type for table "recommendation" */
export type Recommendation_On_Conflict = {
  constraint: Recommendation_Constraint;
  update_columns?: Array<Recommendation_Update_Column>;
  where?: InputMaybe<Recommendation_Bool_Exp>;
};

/** Ordering options when selecting data from "recommendation". */
export type Recommendation_Order_By = {
  analysis_date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  job?: InputMaybe<Job_Order_By>;
  job_id?: InputMaybe<Order_By>;
  prep_aggregate?: InputMaybe<Interview_Prep_Aggregate_Order_By>;
  reasoning?: InputMaybe<Order_By>;
  res_id?: InputMaybe<Order_By>;
  resume?: InputMaybe<Resume_Order_By>;
  score?: InputMaybe<Order_By>;
  skill_matches?: InputMaybe<Order_By>;
  skill_misses?: InputMaybe<Order_By>;
};

/** primary key columns input for table: recommendation */
export type Recommendation_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "recommendation" */
export type Recommendation_Select_Column =
  /** column name */
  | 'analysis_date'
  /** column name */
  | 'id'
  /** column name */
  | 'job_id'
  /** column name */
  | 'reasoning'
  /** column name */
  | 'res_id'
  /** column name */
  | 'score'
  /** column name */
  | 'skill_matches'
  /** column name */
  | 'skill_misses';

/** select "recommendation_aggregate_bool_exp_avg_arguments_columns" columns of table "recommendation" */
export type Recommendation_Select_Column_Recommendation_Aggregate_Bool_Exp_Avg_Arguments_Columns =
  /** column name */
  | 'score';

/** select "recommendation_aggregate_bool_exp_corr_arguments_columns" columns of table "recommendation" */
export type Recommendation_Select_Column_Recommendation_Aggregate_Bool_Exp_Corr_Arguments_Columns =
  /** column name */
  | 'score';

/** select "recommendation_aggregate_bool_exp_covar_samp_arguments_columns" columns of table "recommendation" */
export type Recommendation_Select_Column_Recommendation_Aggregate_Bool_Exp_Covar_Samp_Arguments_Columns =
  /** column name */
  | 'score';

/** select "recommendation_aggregate_bool_exp_max_arguments_columns" columns of table "recommendation" */
export type Recommendation_Select_Column_Recommendation_Aggregate_Bool_Exp_Max_Arguments_Columns =
  /** column name */
  | 'score';

/** select "recommendation_aggregate_bool_exp_min_arguments_columns" columns of table "recommendation" */
export type Recommendation_Select_Column_Recommendation_Aggregate_Bool_Exp_Min_Arguments_Columns =
  /** column name */
  | 'score';

/** select "recommendation_aggregate_bool_exp_stddev_samp_arguments_columns" columns of table "recommendation" */
export type Recommendation_Select_Column_Recommendation_Aggregate_Bool_Exp_Stddev_Samp_Arguments_Columns =
  /** column name */
  | 'score';

/** select "recommendation_aggregate_bool_exp_sum_arguments_columns" columns of table "recommendation" */
export type Recommendation_Select_Column_Recommendation_Aggregate_Bool_Exp_Sum_Arguments_Columns =
  /** column name */
  | 'score';

/** select "recommendation_aggregate_bool_exp_var_samp_arguments_columns" columns of table "recommendation" */
export type Recommendation_Select_Column_Recommendation_Aggregate_Bool_Exp_Var_Samp_Arguments_Columns =
  /** column name */
  | 'score';

/** input type for updating data in table "recommendation" */
export type Recommendation_Set_Input = {
  analysis_date?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  job_id?: InputMaybe<Scalars['Int']['input']>;
  reasoning?: InputMaybe<Scalars['String']['input']>;
  res_id?: InputMaybe<Scalars['Int']['input']>;
  score?: InputMaybe<Scalars['float8']['input']>;
  skill_matches?: InputMaybe<Scalars['_text']['input']>;
  skill_misses?: InputMaybe<Scalars['_text']['input']>;
};

/** aggregate stddev on columns */
export type Recommendation_Stddev_Fields = {
  __typename?: 'recommendation_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
  job_id?: Maybe<Scalars['Float']['output']>;
  res_id?: Maybe<Scalars['Float']['output']>;
  score?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "recommendation" */
export type Recommendation_Stddev_Order_By = {
  id?: InputMaybe<Order_By>;
  job_id?: InputMaybe<Order_By>;
  res_id?: InputMaybe<Order_By>;
  score?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Recommendation_Stddev_Pop_Fields = {
  __typename?: 'recommendation_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  job_id?: Maybe<Scalars['Float']['output']>;
  res_id?: Maybe<Scalars['Float']['output']>;
  score?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "recommendation" */
export type Recommendation_Stddev_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  job_id?: InputMaybe<Order_By>;
  res_id?: InputMaybe<Order_By>;
  score?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Recommendation_Stddev_Samp_Fields = {
  __typename?: 'recommendation_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  job_id?: Maybe<Scalars['Float']['output']>;
  res_id?: Maybe<Scalars['Float']['output']>;
  score?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "recommendation" */
export type Recommendation_Stddev_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  job_id?: InputMaybe<Order_By>;
  res_id?: InputMaybe<Order_By>;
  score?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "recommendation" */
export type Recommendation_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Recommendation_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Recommendation_Stream_Cursor_Value_Input = {
  analysis_date?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  job_id?: InputMaybe<Scalars['Int']['input']>;
  reasoning?: InputMaybe<Scalars['String']['input']>;
  res_id?: InputMaybe<Scalars['Int']['input']>;
  score?: InputMaybe<Scalars['float8']['input']>;
  skill_matches?: InputMaybe<Scalars['_text']['input']>;
  skill_misses?: InputMaybe<Scalars['_text']['input']>;
};

/** aggregate sum on columns */
export type Recommendation_Sum_Fields = {
  __typename?: 'recommendation_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
  job_id?: Maybe<Scalars['Int']['output']>;
  res_id?: Maybe<Scalars['Int']['output']>;
  score?: Maybe<Scalars['float8']['output']>;
};

/** order by sum() on columns of table "recommendation" */
export type Recommendation_Sum_Order_By = {
  id?: InputMaybe<Order_By>;
  job_id?: InputMaybe<Order_By>;
  res_id?: InputMaybe<Order_By>;
  score?: InputMaybe<Order_By>;
};

/** update columns of table "recommendation" */
export type Recommendation_Update_Column =
  /** column name */
  | 'analysis_date'
  /** column name */
  | 'id'
  /** column name */
  | 'job_id'
  /** column name */
  | 'reasoning'
  /** column name */
  | 'res_id'
  /** column name */
  | 'score'
  /** column name */
  | 'skill_matches'
  /** column name */
  | 'skill_misses';

export type Recommendation_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Recommendation_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Recommendation_Set_Input>;
  /** filter the rows which have to be updated */
  where: Recommendation_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Recommendation_Var_Pop_Fields = {
  __typename?: 'recommendation_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  job_id?: Maybe<Scalars['Float']['output']>;
  res_id?: Maybe<Scalars['Float']['output']>;
  score?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "recommendation" */
export type Recommendation_Var_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  job_id?: InputMaybe<Order_By>;
  res_id?: InputMaybe<Order_By>;
  score?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Recommendation_Var_Samp_Fields = {
  __typename?: 'recommendation_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  job_id?: Maybe<Scalars['Float']['output']>;
  res_id?: Maybe<Scalars['Float']['output']>;
  score?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "recommendation" */
export type Recommendation_Var_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  job_id?: InputMaybe<Order_By>;
  res_id?: InputMaybe<Order_By>;
  score?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Recommendation_Variance_Fields = {
  __typename?: 'recommendation_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
  job_id?: Maybe<Scalars['Float']['output']>;
  res_id?: Maybe<Scalars['Float']['output']>;
  score?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "recommendation" */
export type Recommendation_Variance_Order_By = {
  id?: InputMaybe<Order_By>;
  job_id?: InputMaybe<Order_By>;
  res_id?: InputMaybe<Order_By>;
  score?: InputMaybe<Order_By>;
};

/** columns and relationships of "resume" */
export type Resume = {
  __typename?: 'resume';
  embedding?: Maybe<Scalars['vector']['output']>;
  extracted_skills?: Maybe<Scalars['_text']['output']>;
  filepath: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  /** An array relationship */
  recommendations: Array<Recommendation>;
  /** An aggregate relationship */
  recommendations_aggregate: Recommendation_Aggregate;
  /** An object relationship */
  resume_user: User;
  summary?: Maybe<Scalars['String']['output']>;
  user_id: Scalars['Int']['output'];
};


/** columns and relationships of "resume" */
export type ResumeRecommendationsArgs = {
  distinct_on?: InputMaybe<Array<Recommendation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Recommendation_Order_By>>;
  where?: InputMaybe<Recommendation_Bool_Exp>;
};


/** columns and relationships of "resume" */
export type ResumeRecommendations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Recommendation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Recommendation_Order_By>>;
  where?: InputMaybe<Recommendation_Bool_Exp>;
};

/** aggregated selection of "resume" */
export type Resume_Aggregate = {
  __typename?: 'resume_aggregate';
  aggregate?: Maybe<Resume_Aggregate_Fields>;
  nodes: Array<Resume>;
};

export type Resume_Aggregate_Bool_Exp = {
  count?: InputMaybe<Resume_Aggregate_Bool_Exp_Count>;
};

export type Resume_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Resume_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Resume_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "resume" */
export type Resume_Aggregate_Fields = {
  __typename?: 'resume_aggregate_fields';
  avg?: Maybe<Resume_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Resume_Max_Fields>;
  min?: Maybe<Resume_Min_Fields>;
  stddev?: Maybe<Resume_Stddev_Fields>;
  stddev_pop?: Maybe<Resume_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Resume_Stddev_Samp_Fields>;
  sum?: Maybe<Resume_Sum_Fields>;
  var_pop?: Maybe<Resume_Var_Pop_Fields>;
  var_samp?: Maybe<Resume_Var_Samp_Fields>;
  variance?: Maybe<Resume_Variance_Fields>;
};


/** aggregate fields of "resume" */
export type Resume_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Resume_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "resume" */
export type Resume_Aggregate_Order_By = {
  avg?: InputMaybe<Resume_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Resume_Max_Order_By>;
  min?: InputMaybe<Resume_Min_Order_By>;
  stddev?: InputMaybe<Resume_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Resume_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Resume_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Resume_Sum_Order_By>;
  var_pop?: InputMaybe<Resume_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Resume_Var_Samp_Order_By>;
  variance?: InputMaybe<Resume_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "resume" */
export type Resume_Arr_Rel_Insert_Input = {
  data: Array<Resume_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Resume_On_Conflict>;
};

/** aggregate avg on columns */
export type Resume_Avg_Fields = {
  __typename?: 'resume_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
  user_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "resume" */
export type Resume_Avg_Order_By = {
  id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "resume". All fields are combined with a logical 'AND'. */
export type Resume_Bool_Exp = {
  _and?: InputMaybe<Array<Resume_Bool_Exp>>;
  _not?: InputMaybe<Resume_Bool_Exp>;
  _or?: InputMaybe<Array<Resume_Bool_Exp>>;
  embedding?: InputMaybe<Vector_Comparison_Exp>;
  extracted_skills?: InputMaybe<_Text_Comparison_Exp>;
  filepath?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  recommendations?: InputMaybe<Recommendation_Bool_Exp>;
  recommendations_aggregate?: InputMaybe<Recommendation_Aggregate_Bool_Exp>;
  resume_user?: InputMaybe<User_Bool_Exp>;
  summary?: InputMaybe<String_Comparison_Exp>;
  user_id?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "resume" */
export type Resume_Constraint =
  /** unique or primary key constraint on columns "filepath" */
  | 'resume_filepath_key'
  /** unique or primary key constraint on columns "id" */
  | 'resume_pkey';

/** input type for incrementing numeric columns in table "resume" */
export type Resume_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  user_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "resume" */
export type Resume_Insert_Input = {
  embedding?: InputMaybe<Scalars['vector']['input']>;
  extracted_skills?: InputMaybe<Scalars['_text']['input']>;
  filepath?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  recommendations?: InputMaybe<Recommendation_Arr_Rel_Insert_Input>;
  resume_user?: InputMaybe<User_Obj_Rel_Insert_Input>;
  summary?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Resume_Max_Fields = {
  __typename?: 'resume_max_fields';
  filepath?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  summary?: Maybe<Scalars['String']['output']>;
  user_id?: Maybe<Scalars['Int']['output']>;
};

/** order by max() on columns of table "resume" */
export type Resume_Max_Order_By = {
  filepath?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  summary?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Resume_Min_Fields = {
  __typename?: 'resume_min_fields';
  filepath?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  summary?: Maybe<Scalars['String']['output']>;
  user_id?: Maybe<Scalars['Int']['output']>;
};

/** order by min() on columns of table "resume" */
export type Resume_Min_Order_By = {
  filepath?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  summary?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "resume" */
export type Resume_Mutation_Response = {
  __typename?: 'resume_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Resume>;
};

/** input type for inserting object relation for remote table "resume" */
export type Resume_Obj_Rel_Insert_Input = {
  data: Resume_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Resume_On_Conflict>;
};

/** on_conflict condition type for table "resume" */
export type Resume_On_Conflict = {
  constraint: Resume_Constraint;
  update_columns?: Array<Resume_Update_Column>;
  where?: InputMaybe<Resume_Bool_Exp>;
};

/** Ordering options when selecting data from "resume". */
export type Resume_Order_By = {
  embedding?: InputMaybe<Order_By>;
  extracted_skills?: InputMaybe<Order_By>;
  filepath?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  recommendations_aggregate?: InputMaybe<Recommendation_Aggregate_Order_By>;
  resume_user?: InputMaybe<User_Order_By>;
  summary?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: resume */
export type Resume_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "resume" */
export type Resume_Select_Column =
  /** column name */
  | 'embedding'
  /** column name */
  | 'extracted_skills'
  /** column name */
  | 'filepath'
  /** column name */
  | 'id'
  /** column name */
  | 'summary'
  /** column name */
  | 'user_id';

/** input type for updating data in table "resume" */
export type Resume_Set_Input = {
  embedding?: InputMaybe<Scalars['vector']['input']>;
  extracted_skills?: InputMaybe<Scalars['_text']['input']>;
  filepath?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  summary?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Resume_Stddev_Fields = {
  __typename?: 'resume_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
  user_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "resume" */
export type Resume_Stddev_Order_By = {
  id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Resume_Stddev_Pop_Fields = {
  __typename?: 'resume_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  user_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "resume" */
export type Resume_Stddev_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Resume_Stddev_Samp_Fields = {
  __typename?: 'resume_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  user_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "resume" */
export type Resume_Stddev_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "resume" */
export type Resume_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Resume_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Resume_Stream_Cursor_Value_Input = {
  embedding?: InputMaybe<Scalars['vector']['input']>;
  extracted_skills?: InputMaybe<Scalars['_text']['input']>;
  filepath?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  summary?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Resume_Sum_Fields = {
  __typename?: 'resume_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
  user_id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "resume" */
export type Resume_Sum_Order_By = {
  id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** update columns of table "resume" */
export type Resume_Update_Column =
  /** column name */
  | 'embedding'
  /** column name */
  | 'extracted_skills'
  /** column name */
  | 'filepath'
  /** column name */
  | 'id'
  /** column name */
  | 'summary'
  /** column name */
  | 'user_id';

export type Resume_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Resume_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Resume_Set_Input>;
  /** filter the rows which have to be updated */
  where: Resume_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Resume_Var_Pop_Fields = {
  __typename?: 'resume_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  user_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "resume" */
export type Resume_Var_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Resume_Var_Samp_Fields = {
  __typename?: 'resume_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  user_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "resume" */
export type Resume_Var_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Resume_Variance_Fields = {
  __typename?: 'resume_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
  user_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "resume" */
export type Resume_Variance_Order_By = {
  id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "interview_prep" */
  interview_prep: Array<Interview_Prep>;
  /** fetch aggregated fields from the table: "interview_prep" */
  interview_prep_aggregate: Interview_Prep_Aggregate;
  /** fetch data from the table: "interview_prep" using primary key columns */
  interview_prep_by_pk?: Maybe<Interview_Prep>;
  /** fetch data from the table in a streaming manner: "interview_prep" */
  interview_prep_stream: Array<Interview_Prep>;
  /** fetch data from the table: "job" */
  job: Array<Job>;
  /** fetch aggregated fields from the table: "job" */
  job_aggregate: Job_Aggregate;
  /** fetch data from the table: "job" using primary key columns */
  job_by_pk?: Maybe<Job>;
  /** fetch data from the table in a streaming manner: "job" */
  job_stream: Array<Job>;
  /** fetch data from the table: "recommendation" */
  recommendation: Array<Recommendation>;
  /** fetch aggregated fields from the table: "recommendation" */
  recommendation_aggregate: Recommendation_Aggregate;
  /** fetch data from the table: "recommendation" using primary key columns */
  recommendation_by_pk?: Maybe<Recommendation>;
  /** fetch data from the table in a streaming manner: "recommendation" */
  recommendation_stream: Array<Recommendation>;
  /** fetch data from the table: "resume" */
  resume: Array<Resume>;
  /** fetch aggregated fields from the table: "resume" */
  resume_aggregate: Resume_Aggregate;
  /** fetch data from the table: "resume" using primary key columns */
  resume_by_pk?: Maybe<Resume>;
  /** fetch data from the table in a streaming manner: "resume" */
  resume_stream: Array<Resume>;
  /** fetch data from the table: "user" */
  user: Array<User>;
  /** fetch aggregated fields from the table: "user" */
  user_aggregate: User_Aggregate;
  /** fetch data from the table: "user" using primary key columns */
  user_by_pk?: Maybe<User>;
  /** fetch data from the table in a streaming manner: "user" */
  user_stream: Array<User>;
};


export type Subscription_RootInterview_PrepArgs = {
  distinct_on?: InputMaybe<Array<Interview_Prep_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Interview_Prep_Order_By>>;
  where?: InputMaybe<Interview_Prep_Bool_Exp>;
};


export type Subscription_RootInterview_Prep_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Interview_Prep_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Interview_Prep_Order_By>>;
  where?: InputMaybe<Interview_Prep_Bool_Exp>;
};


export type Subscription_RootInterview_Prep_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Subscription_RootInterview_Prep_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Interview_Prep_Stream_Cursor_Input>>;
  where?: InputMaybe<Interview_Prep_Bool_Exp>;
};


export type Subscription_RootJobArgs = {
  distinct_on?: InputMaybe<Array<Job_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Job_Order_By>>;
  where?: InputMaybe<Job_Bool_Exp>;
};


export type Subscription_RootJob_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Job_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Job_Order_By>>;
  where?: InputMaybe<Job_Bool_Exp>;
};


export type Subscription_RootJob_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Subscription_RootJob_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Job_Stream_Cursor_Input>>;
  where?: InputMaybe<Job_Bool_Exp>;
};


export type Subscription_RootRecommendationArgs = {
  distinct_on?: InputMaybe<Array<Recommendation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Recommendation_Order_By>>;
  where?: InputMaybe<Recommendation_Bool_Exp>;
};


export type Subscription_RootRecommendation_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Recommendation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Recommendation_Order_By>>;
  where?: InputMaybe<Recommendation_Bool_Exp>;
};


export type Subscription_RootRecommendation_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Subscription_RootRecommendation_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Recommendation_Stream_Cursor_Input>>;
  where?: InputMaybe<Recommendation_Bool_Exp>;
};


export type Subscription_RootResumeArgs = {
  distinct_on?: InputMaybe<Array<Resume_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Resume_Order_By>>;
  where?: InputMaybe<Resume_Bool_Exp>;
};


export type Subscription_RootResume_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Resume_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Resume_Order_By>>;
  where?: InputMaybe<Resume_Bool_Exp>;
};


export type Subscription_RootResume_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Subscription_RootResume_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Resume_Stream_Cursor_Input>>;
  where?: InputMaybe<Resume_Bool_Exp>;
};


export type Subscription_RootUserArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Subscription_RootUser_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Subscription_RootUser_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Subscription_RootUser_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<User_Stream_Cursor_Input>>;
  where?: InputMaybe<User_Bool_Exp>;
};

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type Timestamp_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamp']['input']>;
  _gt?: InputMaybe<Scalars['timestamp']['input']>;
  _gte?: InputMaybe<Scalars['timestamp']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamp']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timestamp']['input']>;
  _lte?: InputMaybe<Scalars['timestamp']['input']>;
  _neq?: InputMaybe<Scalars['timestamp']['input']>;
  _nin?: InputMaybe<Array<Scalars['timestamp']['input']>>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']['input']>;
  _gt?: InputMaybe<Scalars['timestamptz']['input']>;
  _gte?: InputMaybe<Scalars['timestamptz']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timestamptz']['input']>;
  _lte?: InputMaybe<Scalars['timestamptz']['input']>;
  _neq?: InputMaybe<Scalars['timestamptz']['input']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
};

/** columns and relationships of "user" */
export type User = {
  __typename?: 'user';
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  password_hash: Scalars['String']['output'];
  /** An array relationship */
  user_resumes: Array<Resume>;
  /** An aggregate relationship */
  user_resumes_aggregate: Resume_Aggregate;
  username: Scalars['String']['output'];
};


/** columns and relationships of "user" */
export type UserUser_ResumesArgs = {
  distinct_on?: InputMaybe<Array<Resume_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Resume_Order_By>>;
  where?: InputMaybe<Resume_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserUser_Resumes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Resume_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Resume_Order_By>>;
  where?: InputMaybe<Resume_Bool_Exp>;
};

/** aggregated selection of "user" */
export type User_Aggregate = {
  __typename?: 'user_aggregate';
  aggregate?: Maybe<User_Aggregate_Fields>;
  nodes: Array<User>;
};

/** aggregate fields of "user" */
export type User_Aggregate_Fields = {
  __typename?: 'user_aggregate_fields';
  avg?: Maybe<User_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<User_Max_Fields>;
  min?: Maybe<User_Min_Fields>;
  stddev?: Maybe<User_Stddev_Fields>;
  stddev_pop?: Maybe<User_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<User_Stddev_Samp_Fields>;
  sum?: Maybe<User_Sum_Fields>;
  var_pop?: Maybe<User_Var_Pop_Fields>;
  var_samp?: Maybe<User_Var_Samp_Fields>;
  variance?: Maybe<User_Variance_Fields>;
};


/** aggregate fields of "user" */
export type User_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<User_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type User_Avg_Fields = {
  __typename?: 'user_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "user". All fields are combined with a logical 'AND'. */
export type User_Bool_Exp = {
  _and?: InputMaybe<Array<User_Bool_Exp>>;
  _not?: InputMaybe<User_Bool_Exp>;
  _or?: InputMaybe<Array<User_Bool_Exp>>;
  email?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  password_hash?: InputMaybe<String_Comparison_Exp>;
  user_resumes?: InputMaybe<Resume_Bool_Exp>;
  user_resumes_aggregate?: InputMaybe<Resume_Aggregate_Bool_Exp>;
  username?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "user" */
export type User_Constraint =
  /** unique or primary key constraint on columns "email" */
  | 'user_email_key'
  /** unique or primary key constraint on columns "id" */
  | 'user_pkey'
  /** unique or primary key constraint on columns "username" */
  | 'user_username_key';

/** input type for incrementing numeric columns in table "user" */
export type User_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "user" */
export type User_Insert_Input = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  password_hash?: InputMaybe<Scalars['String']['input']>;
  user_resumes?: InputMaybe<Resume_Arr_Rel_Insert_Input>;
  username?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type User_Max_Fields = {
  __typename?: 'user_max_fields';
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  password_hash?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type User_Min_Fields = {
  __typename?: 'user_min_fields';
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  password_hash?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "user" */
export type User_Mutation_Response = {
  __typename?: 'user_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<User>;
};

/** input type for inserting object relation for remote table "user" */
export type User_Obj_Rel_Insert_Input = {
  data: User_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<User_On_Conflict>;
};

/** on_conflict condition type for table "user" */
export type User_On_Conflict = {
  constraint: User_Constraint;
  update_columns?: Array<User_Update_Column>;
  where?: InputMaybe<User_Bool_Exp>;
};

/** Ordering options when selecting data from "user". */
export type User_Order_By = {
  email?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  password_hash?: InputMaybe<Order_By>;
  user_resumes_aggregate?: InputMaybe<Resume_Aggregate_Order_By>;
  username?: InputMaybe<Order_By>;
};

/** primary key columns input for table: user */
export type User_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "user" */
export type User_Select_Column =
  /** column name */
  | 'email'
  /** column name */
  | 'id'
  /** column name */
  | 'name'
  /** column name */
  | 'password_hash'
  /** column name */
  | 'username';

/** input type for updating data in table "user" */
export type User_Set_Input = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  password_hash?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type User_Stddev_Fields = {
  __typename?: 'user_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type User_Stddev_Pop_Fields = {
  __typename?: 'user_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type User_Stddev_Samp_Fields = {
  __typename?: 'user_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "user" */
export type User_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: User_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type User_Stream_Cursor_Value_Input = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  password_hash?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type User_Sum_Fields = {
  __typename?: 'user_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "user" */
export type User_Update_Column =
  /** column name */
  | 'email'
  /** column name */
  | 'id'
  /** column name */
  | 'name'
  /** column name */
  | 'password_hash'
  /** column name */
  | 'username';

export type User_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<User_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<User_Set_Input>;
  /** filter the rows which have to be updated */
  where: User_Bool_Exp;
};

/** aggregate var_pop on columns */
export type User_Var_Pop_Fields = {
  __typename?: 'user_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type User_Var_Samp_Fields = {
  __typename?: 'user_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type User_Variance_Fields = {
  __typename?: 'user_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to compare columns of type "vector". All fields are combined with logical 'AND'. */
export type Vector_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['vector']['input']>;
  _gt?: InputMaybe<Scalars['vector']['input']>;
  _gte?: InputMaybe<Scalars['vector']['input']>;
  _in?: InputMaybe<Array<Scalars['vector']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['vector']['input']>;
  _lte?: InputMaybe<Scalars['vector']['input']>;
  _neq?: InputMaybe<Scalars['vector']['input']>;
  _nin?: InputMaybe<Array<Scalars['vector']['input']>>;
};

export type CheckRecommendationOwnershipAndExistenceQueryVariables = Exact<{
  rec_id: Scalars['Int']['input'];
  user_id: Scalars['Int']['input'];
}>;


export type CheckRecommendationOwnershipAndExistenceQuery = { __typename?: 'query_root', recommendation: Array<{ __typename?: 'recommendation', id: number }> };

export type CheckResumeOwnershipQueryVariables = Exact<{
  id: Scalars['Int']['input'];
  user_id: Scalars['Int']['input'];
}>;


export type CheckResumeOwnershipQuery = { __typename?: 'query_root', resume: Array<{ __typename?: 'resume', id: number, user_id: number, filepath: string }> };

export type InsertResumeMutationVariables = Exact<{
  user_id: Scalars['Int']['input'];
  filepath: Scalars['String']['input'];
}>;


export type InsertResumeMutation = { __typename?: 'mutation_root', insert_resume_one?: { __typename?: 'resume', id: number } | null };

export type SelectUserAndPasswordQueryVariables = Exact<{
  username: Scalars['String']['input'];
}>;


export type SelectUserAndPasswordQuery = { __typename?: 'query_root', user: Array<{ __typename?: 'user', id: number, username: string, password_hash: string }> };

export type CheckUserAlreadyExistsQueryVariables = Exact<{
  username: Scalars['String']['input'];
  email: Scalars['String']['input'];
}>;


export type CheckUserAlreadyExistsQuery = { __typename?: 'query_root', user: Array<{ __typename?: 'user', id: number, email: string, username: string }> };

export type CreateUserMutationVariables = Exact<{
  username: Scalars['String']['input'];
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password_hash: Scalars['String']['input'];
}>;


export type CreateUserMutation = { __typename?: 'mutation_root', insert_user_one?: { __typename?: 'user', id: number } | null };


export const CheckRecommendationOwnershipAndExistenceDocument = gql`
    query CheckRecommendationOwnershipAndExistence($rec_id: Int!, $user_id: Int!) {
  recommendation(
    where: {_and: [{id: {_eq: $rec_id}}, {resume: {user_id: {_eq: $user_id}}}]}
  ) {
    id
  }
}
    `;
export const CheckResumeOwnershipDocument = gql`
    query CheckResumeOwnership($id: Int!, $user_id: Int!) {
  resume(where: {_and: [{id: {_eq: $id}}, {user_id: {_eq: $user_id}}]}) {
    id
    user_id
    filepath
  }
}
    `;
export const InsertResumeDocument = gql`
    mutation InsertResume($user_id: Int!, $filepath: String!) {
  insert_resume_one(object: {user_id: $user_id, filepath: $filepath}) {
    id
  }
}
    `;
export const SelectUserAndPasswordDocument = gql`
    query SelectUserAndPassword($username: String!) {
  user(where: {username: {_eq: $username}}) {
    id
    username
    password_hash
  }
}
    `;
export const CheckUserAlreadyExistsDocument = gql`
    query CheckUserAlreadyExists($username: String!, $email: String!) {
  user(where: {_or: [{username: {_eq: $username}}, {email: {_eq: $email}}]}) {
    id
    email
    username
  }
}
    `;
export const CreateUserDocument = gql`
    mutation CreateUser($username: String!, $email: String!, $name: String!, $password_hash: String!) {
  insert_user_one(
    object: {username: $username, email: $email, name: $name, password_hash: $password_hash}
  ) {
    id
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?: Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    CheckRecommendationOwnershipAndExistence(variables: CheckRecommendationOwnershipAndExistenceQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CheckRecommendationOwnershipAndExistenceQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CheckRecommendationOwnershipAndExistenceQuery>({ document: CheckRecommendationOwnershipAndExistenceDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CheckRecommendationOwnershipAndExistence', 'query', variables);
    },
    CheckResumeOwnership(variables: CheckResumeOwnershipQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CheckResumeOwnershipQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CheckResumeOwnershipQuery>({ document: CheckResumeOwnershipDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CheckResumeOwnership', 'query', variables);
    },
    InsertResume(variables: InsertResumeMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<InsertResumeMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<InsertResumeMutation>({ document: InsertResumeDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'InsertResume', 'mutation', variables);
    },
    SelectUserAndPassword(variables: SelectUserAndPasswordQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<SelectUserAndPasswordQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SelectUserAndPasswordQuery>({ document: SelectUserAndPasswordDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'SelectUserAndPassword', 'query', variables);
    },
    CheckUserAlreadyExists(variables: CheckUserAlreadyExistsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CheckUserAlreadyExistsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CheckUserAlreadyExistsQuery>({ document: CheckUserAlreadyExistsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CheckUserAlreadyExists', 'query', variables);
    },
    CreateUser(variables: CreateUserMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateUserMutation>({ document: CreateUserDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateUser', 'mutation', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
