export interface Database {
  public: {
    Tables: {
      subjects: {
        Row: {
          id: string
          name: string
          key: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          key: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          key?: string
          created_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          subject_id: string
          title: string
          body: string
          topic: string
          difficulty: number
          created_at: string
        }
        Insert: {
          id?: string
          subject_id: string
          title: string
          body: string
          topic: string
          difficulty: number
          created_at?: string
        }
        Update: {
          id?: string
          subject_id?: string
          title?: string
          body?: string
          topic?: string
          difficulty?: number
          created_at?: string
        }
      }
      options: {
        Row: {
          id: string
          question_id: string
          text: string
          is_correct: boolean
          created_at: string
        }
        Insert: {
          id?: string
          question_id: string
          text: string
          is_correct: boolean
          created_at?: string
        }
        Update: {
          id?: string
          question_id?: string
          text?: string
          is_correct?: boolean
          created_at?: string
        }
      }
      tests: {
        Row: {
          id: string
          subject_id: string
          title: string
          duration_minutes: number
          shuffle: boolean
          created_at: string
        }
        Insert: {
          id?: string
          subject_id: string
          title: string
          duration_minutes: number
          shuffle: boolean
          created_at?: string
        }
        Update: {
          id?: string
          subject_id?: string
          title?: string
          duration_minutes?: number
          shuffle?: boolean
          created_at?: string
        }
      }
      test_questions: {
        Row: {
          id: string
          test_id: string
          question_id: string
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          test_id: string
          question_id: string
          position: number
          created_at?: string
        }
        Update: {
          id?: string
          test_id?: string
          question_id?: string
          position?: number
          created_at?: string
        }
      }
      attempts: {
        Row: {
          id: string
          user_id: string
          test_id: string
          started_at: string
          submitted_at: string | null
          score: number | null
          total_marks: number | null
          summary: any | null
          result_json: any | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          test_id: string
          started_at: string
          submitted_at?: string | null
          score?: number | null
          total_marks?: number | null
          summary?: any | null
          result_json?: any | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          test_id?: string
          started_at?: string
          submitted_at?: string | null
          score?: number | null
          total_marks?: number | null
          summary?: any | null
          result_json?: any | null
          created_at?: string
        }
      }
      answers: {
        Row: {
          id: string
          attempt_id: string
          question_id: string
          selected_option_ids: number[]
          correct: boolean | null
          marks_awarded: number | null
          created_at: string
        }
        Insert: {
          id?: string
          attempt_id: string
          question_id: string
          selected_option_ids: number[]
          correct?: boolean | null
          marks_awarded?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          attempt_id?: string
          question_id?: string
          selected_option_ids?: number[]
          correct?: boolean | null
          marks_awarded?: number | null
          created_at?: string
        }
      }
      channels: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          channel_id: string
          user_id: string
          content: string
          parent_message_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          channel_id: string
          user_id: string
          content: string
          parent_message_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          channel_id?: string
          user_id?: string
          content?: string
          parent_message_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reactions: {
        Row: {
          id: string
          message_id: string
          user_id: string
          emoji: string
          created_at: string
        }
        Insert: {
          id?: string
          message_id: string
          user_id: string
          emoji: string
          created_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          user_id?: string
          emoji?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          user_name: string | null
          phone_number: string | null
          city: string | null
          pincode: string | null
          target_exam: string | null
          role: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          user_name?: string | null
          phone_number?: string | null
          city?: string | null
          pincode?: string | null
          target_exam?: string | null
          role?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          user_name?: string | null
          phone_number?: string | null
          city?: string | null
          pincode?: string | null
          target_exam?: string | null
          role?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
