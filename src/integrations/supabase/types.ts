export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      injections: {
        Row: {
          created_at: string
          dose_amount: number
          dose_unit: string
          id: string
          injection_date: string
          injection_site: string
          notes: string | null
          peptide_name: string
          user_id: string
          vial_id: string | null
        }
        Insert: {
          created_at?: string
          dose_amount: number
          dose_unit?: string
          id?: string
          injection_date: string
          injection_site: string
          notes?: string | null
          peptide_name: string
          user_id: string
          vial_id?: string | null
        }
        Update: {
          created_at?: string
          dose_amount?: number
          dose_unit?: string
          id?: string
          injection_date?: string
          injection_site?: string
          notes?: string | null
          peptide_name?: string
          user_id?: string
          vial_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "injections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "injections_vial_id_fkey"
            columns: ["vial_id"]
            isOneToOne: false
            referencedRelation: "vials"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      progress_photos: {
        Row: {
          created_at: string
          date_taken: string
          id: string
          measurements: Json | null
          notes: string | null
          peptides_used: string[] | null
          photo_url: string
          updated_at: string
          user_id: string
          weight: number | null
        }
        Insert: {
          created_at?: string
          date_taken?: string
          id?: string
          measurements?: Json | null
          notes?: string | null
          peptides_used?: string[] | null
          photo_url: string
          updated_at?: string
          user_id: string
          weight?: number | null
        }
        Update: {
          created_at?: string
          date_taken?: string
          id?: string
          measurements?: Json | null
          notes?: string | null
          peptides_used?: string[] | null
          photo_url?: string
          updated_at?: string
          user_id?: string
          weight?: number | null
        }
        Relationships: []
      }
      protocol_reminders: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          protocol_id: string
          reminder_days: string[]
          reminder_time: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          protocol_id: string
          reminder_days: string[]
          reminder_time: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          protocol_id?: string
          reminder_days?: string[]
          reminder_time?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "protocol_reminders_protocol_id_fkey"
            columns: ["protocol_id"]
            isOneToOne: false
            referencedRelation: "protocols"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "protocol_reminders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      protocols: {
        Row: {
          benefits: string[]
          category: string
          common_stacks: string[]
          created_at: string
          cycle_length: string
          description: string
          expected_results: string[]
          frequency: string
          id: string
          peptide_name: string
          recommended_dose: string
          warnings: string[]
        }
        Insert: {
          benefits: string[]
          category: string
          common_stacks: string[]
          created_at?: string
          cycle_length: string
          description: string
          expected_results: string[]
          frequency: string
          id?: string
          peptide_name: string
          recommended_dose: string
          warnings: string[]
        }
        Update: {
          benefits?: string[]
          category?: string
          common_stacks?: string[]
          created_at?: string
          cycle_length?: string
          description?: string
          expected_results?: string[]
          frequency?: string
          id?: string
          peptide_name?: string
          recommended_dose?: string
          warnings?: string[]
        }
        Relationships: []
      }
      user_saved_protocols: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          protocol_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          protocol_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          protocol_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_saved_protocols_protocol_id_fkey"
            columns: ["protocol_id"]
            isOneToOne: false
            referencedRelation: "protocols"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_saved_protocols_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          ai_message_count: number
          ai_message_limit: number
          ai_messages_reset_date: string | null
          created_at: string
          current_period_end: string | null
          id: string
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_message_count?: number
          ai_message_limit?: number
          ai_messages_reset_date?: string | null
          created_at?: string
          current_period_end?: string | null
          id?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_message_count?: number
          ai_message_limit?: number
          ai_messages_reset_date?: string | null
          created_at?: string
          current_period_end?: string | null
          id?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      vials: {
        Row: {
          bac_water_ml: number
          created_at: string
          expiration_date: string | null
          id: string
          notes: string | null
          peptide_name: string
          reconstitution_date: string
          remaining_amount_mg: number
          status: string
          total_amount_mg: number
          updated_at: string
          user_id: string
        }
        Insert: {
          bac_water_ml: number
          created_at?: string
          expiration_date?: string | null
          id?: string
          notes?: string | null
          peptide_name: string
          reconstitution_date: string
          remaining_amount_mg: number
          status?: string
          total_amount_mg: number
          updated_at?: string
          user_id: string
        }
        Update: {
          bac_water_ml?: number
          created_at?: string
          expiration_date?: string | null
          id?: string
          notes?: string | null
          peptide_name?: string
          reconstitution_date?: string
          remaining_amount_mg?: number
          status?: string
          total_amount_mg?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vials_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_and_increment_ai_usage: {
        Args: { p_user_id: string }
        Returns: {
          allowed: boolean
          limit_value: number
          remaining: number
        }[]
      }
      get_ai_usage: {
        Args: { p_user_id: string }
        Returns: {
          limit_value: number
          remaining: number
          reset_date: string
          used: number
        }[]
      }
      is_premium_user: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      subscription_status: "free" | "premium"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      subscription_status: ["free", "premium"],
    },
  },
} as const
