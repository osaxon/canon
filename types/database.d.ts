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
      followers: {
        Row: {
          created_at: string | null
          follower_profile_id: string | null
          profile_id: string | null
        }
        Insert: {
          created_at?: string | null
          follower_profile_id?: string | null
          profile_id?: string | null
        }
        Update: {
          created_at?: string | null
          follower_profile_id?: string | null
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "followers_follower_profile_id_fkey"
            columns: ["follower_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      following: {
        Row: {
          created_at: string | null
          following_profile_id: string | null
          profile_id: string | null
        }
        Insert: {
          created_at?: string | null
          following_profile_id?: string | null
          profile_id?: string | null
        }
        Update: {
          created_at?: string | null
          following_profile_id?: string | null
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "following_following_profile_id_fkey"
            columns: ["following_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "following_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          follower_count: number
          full_name: string | null
          id: string
          points: number | null
          rank: number | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          follower_count?: number
          full_name?: string | null
          id: string
          points?: number | null
          rank?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          follower_count?: number
          full_name?: string | null
          id?: string
          points?: number | null
          rank?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      stories: {
        Row: {
          comment_count: number
          created_at: string | null
          created_by: string | null
          id: number
          theme: string | null
          votes: number
        }
        Insert: {
          comment_count?: number
          created_at?: string | null
          created_by?: string | null
          id?: number
          theme?: string | null
          votes?: number
        }
        Update: {
          comment_count?: number
          created_at?: string | null
          created_by?: string | null
          id?: number
          theme?: string | null
          votes?: number
        }
        Relationships: [
          {
            foreignKeyName: "stories_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      story_comments: {
        Row: {
          content: string | null
          created_at: string
          id: number
          profile_id: string | null
          story_id: number | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: number
          profile_id?: string | null
          story_id?: number | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: number
          profile_id?: string | null
          story_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "story_comments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_comments_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          }
        ]
      }
      story_item_comments: {
        Row: {
          content: string | null
          created_at: string | null
          id: number
          profile_id: string | null
          story_item_id: number | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id: number
          profile_id?: string | null
          story_item_id?: number | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: number
          profile_id?: string | null
          story_item_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "story_item_comments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_item_comments_story_item_id_fkey"
            columns: ["story_item_id"]
            isOneToOne: false
            referencedRelation: "story_items"
            referencedColumns: ["id"]
          }
        ]
      }
      story_items: {
        Row: {
          comment_count: number
          created_at: string | null
          id: number
          image_url: string
          profile_id: string | null
          prompt: string
          story_id: number
          votes: number
        }
        Insert: {
          comment_count?: number
          created_at?: string | null
          id?: number
          image_url: string
          profile_id?: string | null
          prompt: string
          story_id: number
          votes?: number
        }
        Update: {
          comment_count?: number
          created_at?: string | null
          id?: number
          image_url?: string
          profile_id?: string | null
          prompt?: string
          story_id?: number
          votes?: number
        }
        Relationships: [
          {
            foreignKeyName: "story_items_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_items_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment: {
        Args: {
          x: number
          row_id: number
        }
        Returns: undefined
      }
      incrementstoryvotes: {
        Args: {
          x: number
          row_id: number
        }
        Returns: undefined
      }
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
