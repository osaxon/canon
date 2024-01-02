export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      comments: {
        Row: {
          content: string | null
          created_at: string | null
          id: number
          story_item_id: number | null
          user_id: number | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id: number
          story_item_id?: number | null
          user_id?: number | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: number
          story_item_id?: number | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_story_item_id_fkey"
            columns: ["story_item_id"]
            isOneToOne: false
            referencedRelation: "story_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      followers: {
        Row: {
          created_at: string | null
          follower_user_id: number | null
          user_id: number | null
        }
        Insert: {
          created_at?: string | null
          follower_user_id?: number | null
          user_id?: number | null
        }
        Update: {
          created_at?: string | null
          follower_user_id?: number | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "followers_follower_user_id_fkey"
            columns: ["follower_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      following: {
        Row: {
          created_at: string | null
          following_user_id: number | null
          user_id: number | null
        }
        Insert: {
          created_at?: string | null
          following_user_id?: number | null
          user_id?: number | null
        }
        Update: {
          created_at?: string | null
          following_user_id?: number | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "following_following_user_id_fkey"
            columns: ["following_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      stories: {
        Row: {
          comment_count: number | null
          created_at: string | null
          id: number
          theme: string | null
          votes: number | null
        }
        Insert: {
          comment_count?: number | null
          created_at?: string | null
          id: number
          theme?: string | null
          votes?: number | null
        }
        Update: {
          comment_count?: number | null
          created_at?: string | null
          id?: number
          theme?: string | null
          votes?: number | null
        }
        Relationships: []
      }
      story_items: {
        Row: {
          comment_count: number | null
          created_at: string | null
          id: number
          image_url: string | null
          prompt: string | null
          story_id: number | null
          user_id: number | null
          votes: number | null
        }
        Insert: {
          comment_count?: number | null
          created_at?: string | null
          id: number
          image_url?: string | null
          prompt?: string | null
          story_id?: number | null
          user_id?: number | null
          votes?: number | null
        }
        Update: {
          comment_count?: number | null
          created_at?: string | null
          id?: number
          image_url?: string | null
          prompt?: string | null
          story_id?: number | null
          user_id?: number | null
          votes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "story_items_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          created_at: string | null
          id: number
          points: number | null
          profile_description: string | null
          profile_image_url: string | null
          rank: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          id: number
          points?: number | null
          profile_description?: string | null
          profile_image_url?: string | null
          rank?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          points?: number | null
          profile_description?: string | null
          profile_image_url?: string | null
          rank?: string | null
          username?: string | null
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
