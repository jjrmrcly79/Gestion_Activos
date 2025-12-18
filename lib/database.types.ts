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
        PostgrestVersion: "14.1"
    }
    public: {
        Tables: {
            alerts: {
                Row: {
                    asset_id: string | null
                    created_at: string | null
                    created_by: string | null
                    description: string
                    id: string
                    measurement_point_id: string | null
                    severity: string | null
                    status: Database["public"]["Enums"]["alert_status"] | null
                    work_order_id: string | null
                }
                Insert: {
                    asset_id?: string | null
                    created_at?: string | null
                    created_by?: string | null
                    description: string
                    id?: string
                    measurement_point_id?: string | null
                    severity?: string | null
                    status?: Database["public"]["Enums"]["alert_status"] | null
                    work_order_id?: string | null
                }
                Update: {
                    asset_id?: string | null
                    created_at?: string | null
                    created_by?: string | null
                    description?: string
                    id?: string
                    measurement_point_id?: string | null
                    severity?: string | null
                    status?: Database["public"]["Enums"]["alert_status"] | null
                    work_order_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "alerts_asset_id_fkey"
                        columns: ["asset_id"]
                        isOneToOne: false
                        referencedRelation: "assets"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "alerts_created_by_fkey"
                        columns: ["created_by"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "alerts_measurement_point_id_fkey"
                        columns: ["measurement_point_id"]
                        isOneToOne: false
                        referencedRelation: "measurement_points"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "alerts_work_order_id_fkey"
                        columns: ["work_order_id"]
                        isOneToOne: false
                        referencedRelation: "work_orders"
                        referencedColumns: ["id"]
                    },
                ]
            }
            assessment_answers: {
                Row: {
                    assessment_id: string
                    block_id: string
                    created_at: string
                    evidence: string | null
                    id: string
                    notes: string | null
                    question_id: string
                    score: number | null
                    updated_at: string
                }
                Insert: {
                    assessment_id: string
                    block_id: string
                    created_at?: string
                    evidence?: string | null
                    id?: string
                    notes?: string | null
                    question_id: string
                    score?: number | null
                    updated_at?: string
                }
                Update: {
                    assessment_id?: string
                    block_id?: string
                    created_at?: string
                    evidence?: string | null
                    id?: string
                    notes?: string | null
                    question_id?: string
                    score?: number | null
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "assessment_answers_assessment_id_fkey"
                        columns: ["assessment_id"]
                        isOneToOne: false
                        referencedRelation: "assessments"
                        referencedColumns: ["id"]
                    },
                ]
            }
            assessments: {
                Row: {
                    created_at: string
                    id: string
                    metadata: Json | null
                    status: string | null
                    updated_at: string
                    user_id: string
                }
                Insert: {
                    created_at?: string
                    id?: string
                    metadata?: Json | null
                    status?: string | null
                    updated_at?: string
                    user_id: string
                }
                Update: {
                    created_at?: string
                    id?: string
                    metadata?: Json | null
                    status?: string | null
                    updated_at?: string
                    user_id?: string
                }
                Relationships: []
            }
            assets: {
                Row: {
                    acquisition_date: string | null
                    barcode: string | null
                    category: string | null
                    cost_center: string | null
                    created_at: string | null
                    created_by: string | null
                    criticality: Database["public"]["Enums"]["criticality_level"]
                    custom_fields: Json | null
                    description: string | null
                    documentation_url: string | null
                    id: string
                    image_url: string | null
                    is_active: boolean
                    last_maintenance_date: string | null
                    lifecycle_phase: Database["public"]["Enums"]["asset_lifecycle_phase"] | null
                    location: string | null
                    maintenance_frequency_days: number | null
                    manufacturer: string | null
                    model: string | null
                    name: string
                    next_maintenance_date: string | null
                    parent_asset_id: string | null
                    purchase_price: number | null
                    qr_code: string | null
                    serial_number: string | null
                    status: string
                    supplier: string | null
                    type: string | null
                    updated_at: string | null
                    warranty_expiry_date: string | null
                }
                Insert: {
                    acquisition_date?: string | null
                    barcode?: string | null
                    category?: string | null
                    cost_center?: string | null
                    created_at?: string | null
                    created_by?: string | null
                    criticality?: Database["public"]["Enums"]["criticality_level"]
                    custom_fields?: Json | null
                    description?: string | null
                    documentation_url?: string | null
                    id?: string
                    image_url?: string | null
                    is_active?: boolean
                    last_maintenance_date?: string | null
                    lifecycle_phase?: Database["public"]["Enums"]["asset_lifecycle_phase"] | null
                    location?: string | null
                    maintenance_frequency_days?: number | null
                    manufacturer?: string | null
                    model?: string | null
                    name: string
                    next_maintenance_date?: string | null
                    parent_asset_id?: string | null
                    purchase_price?: number | null
                    qr_code?: string | null
                    serial_number?: string | null
                    status?: string
                    supplier?: string | null
                    type?: string | null
                    updated_at?: string | null
                    warranty_expiry_date?: string | null
                }
                Update: {
                    acquisition_date?: string | null
                    barcode?: string | null
                    category?: string | null
                    cost_center?: string | null
                    created_at?: string | null
                    created_by?: string | null
                    criticality?: Database["public"]["Enums"]["criticality_level"]
                    custom_fields?: Json | null
                    description?: string | null
                    documentation_url?: string | null
                    id?: string
                    image_url?: string | null
                    is_active?: boolean
                    last_maintenance_date?: string | null
                    lifecycle_phase?: Database["public"]["Enums"]["asset_lifecycle_phase"] | null
                    location?: string | null
                    maintenance_frequency_days?: number | null
                    manufacturer?: string | null
                    model?: string | null
                    name?: string
                    next_maintenance_date?: string | null
                    parent_asset_id?: string | null
                    purchase_price?: number | null
                    qr_code?: string | null
                    serial_number?: string | null
                    status?: string
                    supplier?: string | null
                    type?: string | null
                    updated_at?: string | null
                    warranty_expiry_date?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "assets_created_by_fkey"
                        columns: ["created_by"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "assets_parent_asset_id_fkey"
                        columns: ["parent_asset_id"]
                        isOneToOne: false
                        referencedRelation: "assets"
                        referencedColumns: ["id"]
                    },
                ]
            }
            decisions: {
                Row: {
                    amount: number | null
                    asset_id: string | null
                    created_at: string | null
                    created_by: string | null
                    description: string | null
                    id: string
                    justification: string | null
                    status: Database["public"]["Enums"]["decision_status"] | null
                    title: string
                    type: Database["public"]["Enums"]["decision_type"]
                    updated_at: string | null
                }
                Insert: {
                    amount?: number | null
                    asset_id?: string | null
                    created_at?: string | null
                    created_by?: string | null
                    description?: string | null
                    id?: string
                    justification?: string | null
                    status?: Database["public"]["Enums"]["decision_status"] | null
                    title: string
                    type: Database["public"]["Enums"]["decision_type"]
                    updated_at?: string | null
                }
                Update: {
                    amount?: number | null
                    asset_id?: string | null
                    created_at?: string | null
                    created_by?: string | null
                    description?: string | null
                    id?: string
                    justification?: string | null
                    status?: Database["public"]["Enums"]["decision_status"] | null
                    title?: string
                    type?: Database["public"]["Enums"]["decision_type"]
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "decisions_asset_id_fkey"
                        columns: ["asset_id"]
                        isOneToOne: false
                        referencedRelation: "assets"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "decisions_created_by_fkey"
                        columns: ["created_by"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            kits: {
                Row: {
                    created_at: string | null
                    description: string | null
                    id: string
                    name: string
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    name: string
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    name?: string
                    updated_at?: string | null
                }
                Relationships: []
            }
            kits_items: {
                Row: {
                    created_at: string | null
                    id: string
                    kit_id: string | null
                    material_id: string | null
                    quantity: number
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    kit_id?: string | null
                    material_id?: string | null
                    quantity?: number
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    kit_id?: string | null
                    material_id?: string | null
                    quantity?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "kits_items_kit_id_fkey"
                        columns: ["kit_id"]
                        isOneToOne: false
                        referencedRelation: "kits"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "kits_items_material_id_fkey"
                        columns: ["material_id"]
                        isOneToOne: false
                        referencedRelation: "warehouse_inventory"
                        referencedColumns: ["id"]
                    },
                ]
            }
            measurement_points: {
                Row: {
                    asset_id: string
                    created_at: string | null
                    description: string | null
                    id: string
                    is_active: boolean
                    location_on_asset: string | null
                    max_val: number | null
                    min_val: number | null
                    name: string
                    unit: string
                    updated_at: string | null
                }
                Insert: {
                    asset_id: string
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    is_active?: boolean
                    location_on_asset?: string | null
                    max_val?: number | null
                    min_val?: number | null
                    name: string
                    unit: string
                    updated_at?: string | null
                }
                Update: {
                    asset_id?: string
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    is_active?: boolean
                    location_on_asset?: string | null
                    max_val?: number | null
                    min_val?: number | null
                    name?: string
                    unit?: string
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "measurement_points_asset_id_fkey"
                        columns: ["asset_id"]
                        isOneToOne: false
                        referencedRelation: "assets"
                        referencedColumns: ["id"]
                    },
                ]
            }
            measurement_readings: {
                Row: {
                    created_at: string | null
                    created_by: string | null
                    id: string
                    measurement_point_id: string
                    notes: string | null
                    reading_date: string
                    value: number
                    work_order_id: string | null
                }
                Insert: {
                    created_at?: string | null
                    created_by?: string | null
                    id?: string
                    measurement_point_id: string
                    notes?: string | null
                    reading_date?: string
                    value: number
                    work_order_id?: string | null
                }
                Update: {
                    created_at?: string | null
                    created_by?: string | null
                    id?: string
                    measurement_point_id?: string
                    notes?: string | null
                    reading_date?: string
                    value?: number
                    work_order_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "measurement_readings_created_by_fkey"
                        columns: ["created_by"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "measurement_readings_measurement_point_id_fkey"
                        columns: ["measurement_point_id"]
                        isOneToOne: false
                        referencedRelation: "measurement_points"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "measurement_readings_work_order_id_fkey"
                        columns: ["work_order_id"]
                        isOneToOne: false
                        referencedRelation: "work_orders"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    created_at: string | null
                    email: string
                    full_name: string | null
                    id: string
                    role: Database["public"]["Enums"]["user_role"]
                    updated_at: string | null
                }
                Insert: {
                    avatar_url?: string | null
                    created_at?: string | null
                    email: string
                    full_name?: string | null
                    id: string
                    role?: Database["public"]["Enums"]["user_role"]
                    updated_at?: string | null
                }
                Update: {
                    avatar_url?: string | null
                    created_at?: string | null
                    email?: string
                    full_name?: string | null
                    id?: string
                    role?: Database["public"]["Enums"]["user_role"]
                    updated_at?: string | null
                }
                Relationships: []
            }
            strategies: {
                Row: {
                    asset_id: string | null
                    created_at: string | null
                    created_by: string | null
                    description: string | null
                    frequency_days: number | null
                    frequency_hours: number | null
                    id: string
                    tasks: string[] | null
                    title: string
                    type: string
                    updated_at: string | null
                }
                Insert: {
                    asset_id?: string | null
                    created_at?: string | null
                    created_by?: string | null
                    description?: string | null
                    frequency_days?: number | null
                    frequency_hours?: number | null
                    id?: string
                    tasks?: string[] | null
                    title: string
                    type: string
                    updated_at?: string | null
                }
                Update: {
                    asset_id?: string | null
                    created_at?: string | null
                    created_by?: string | null
                    description?: string | null
                    frequency_days?: number | null
                    frequency_hours?: number | null
                    id?: string
                    tasks?: string[] | null
                    title?: string
                    type?: string
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "strategies_asset_id_fkey"
                        columns: ["asset_id"]
                        isOneToOne: false
                        referencedRelation: "assets"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "strategies_created_by_fkey"
                        columns: ["created_by"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            tasks: {
                Row: {
                    completed_at: string | null
                    created_at: string | null
                    description: string | null
                    estimated_hours: number | null
                    id: string
                    is_completed: boolean
                    title: string
                    work_order_id: string | null
                }
                Insert: {
                    completed_at?: string | null
                    created_at?: string | null
                    description?: string | null
                    estimated_hours?: number | null
                    id?: string
                    is_completed?: boolean
                    title: string
                    work_order_id?: string | null
                }
                Update: {
                    completed_at?: string | null
                    created_at?: string | null
                    description?: string | null
                    estimated_hours?: number | null
                    id?: string
                    is_completed?: boolean
                    title?: string
                    work_order_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "tasks_work_order_id_fkey"
                        columns: ["work_order_id"]
                        isOneToOne: false
                        referencedRelation: "work_orders"
                        referencedColumns: ["id"]
                    },
                ]
            }
            warehouse_inventory: {
                Row: {
                    category: string | null
                    created_at: string | null
                    current_stock: number
                    description: string | null
                    id: string
                    location: string | null
                    min_stock: number
                    name: string
                    sku: string
                    unit: string
                    unit_price: number | null
                    updated_at: string | null
                }
                Insert: {
                    category?: string | null
                    created_at?: string | null
                    current_stock?: number
                    description?: string | null
                    id?: string
                    location?: string | null
                    min_stock?: number
                    name: string
                    sku: string
                    unit: string
                    unit_price?: number | null
                    updated_at?: string | null
                }
                Update: {
                    category?: string | null
                    created_at?: string | null
                    current_stock?: number
                    description?: string | null
                    id?: string
                    location?: string | null
                    min_stock?: number
                    name?: string
                    sku?: string
                    unit?: string
                    unit_price?: number | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            warehouse_movements: {
                Row: {
                    created_at: string | null
                    created_by: string | null
                    id: string
                    item_id: string | null
                    movement_type: Database["public"]["Enums"]["movement_type"]
                    notes: string | null
                    quantity: number
                    work_order_id: string | null
                }
                Insert: {
                    created_at?: string | null
                    created_by?: string | null
                    id?: string
                    item_id?: string | null
                    movement_type: Database["public"]["Enums"]["movement_type"]
                    notes?: string | null
                    quantity: number
                    work_order_id?: string | null
                }
                Update: {
                    created_at?: string | null
                    created_by?: string | null
                    id?: string
                    item_id?: string | null
                    movement_type?: Database["public"]["Enums"]["movement_type"]
                    notes?: string | null
                    quantity?: number
                    work_order_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "warehouse_movements_created_by_fkey"
                        columns: ["created_by"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "warehouse_movements_item_id_fkey"
                        columns: ["item_id"]
                        isOneToOne: false
                        referencedRelation: "warehouse_inventory"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "warehouse_movements_work_order_id_fkey"
                        columns: ["work_order_id"]
                        isOneToOne: false
                        referencedRelation: "work_orders"
                        referencedColumns: ["id"]
                    },
                ]
            }
            work_orders: {
                Row: {
                    address_id: string | null
                    assigned_to: string | null
                    completed_at: string | null
                    created_at: string | null
                    created_by: string | null
                    description: string | null
                    due_date: string | null
                    id: string
                    priority: Database["public"]["Enums"]["work_order_priority"]
                    started_at: string | null
                    status: Database["public"]["Enums"]["work_order_status"]
                    title: string
                    type: Database["public"]["Enums"]["work_order_type"]
                    updated_at: string | null
                }
                Insert: {
                    address_id?: string | null
                    assigned_to?: string | null
                    completed_at?: string | null
                    created_at?: string | null
                    created_by?: string | null
                    description?: string | null
                    due_date?: string | null
                    id?: string
                    priority?: Database["public"]["Enums"]["work_order_priority"]
                    started_at?: string | null
                    status?: Database["public"]["Enums"]["work_order_status"]
                    title: string
                    type?: Database["public"]["Enums"]["work_order_type"]
                    updated_at?: string | null
                }
                Update: {
                    address_id?: string | null
                    assigned_to?: string | null
                    completed_at?: string | null
                    created_at?: string | null
                    created_by?: string | null
                    description?: string | null
                    due_date?: string | null
                    id?: string
                    priority?: Database["public"]["Enums"]["work_order_priority"]
                    started_at?: string | null
                    status?: Database["public"]["Enums"]["work_order_status"]
                    title?: string
                    type?: Database["public"]["Enums"]["work_order_type"]
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "work_orders_address_id_fkey"
                        columns: ["address_id"]
                        isOneToOne: false
                        referencedRelation: "assets"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "work_orders_assigned_to_fkey"
                        columns: ["assigned_to"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "work_orders_created_by_fkey"
                        columns: ["created_by"]
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
            [_ in never]: never
        }
        Enums: {
            alert_status: "new" | "acknowledged" | "resolved"
            asset_lifecycle_phase:
            | "planning"
            | "acquisition"
            | "operation"
            | "maintenance"
            | "disposal"
            criticality_level: "low" | "medium" | "high" | "critical"
            decision_status:
            | "proposed"
            | "analyzing"
            | "approved"
            | "rejected"
            | "deferred"
            decision_type:
            | "capex"
            | "opex"
            | "disposal"
            | "replacement"
            | "expansion"
            movement_type: "inbound" | "outbound_wo" | "adjustment" | "return"
            user_role:
            | "technician"
            | "planner"
            | "supervisor"
            | "warehouse"
            | "industrial_read_only"
            | "admin"
            work_order_priority: "low" | "medium" | "high" | "emergency"
            work_order_status:
            | "draft"
            | "assigned"
            | "kit_requested"
            | "kit_ready"
            | "in_progress"
            | "completed"
            | "verified"
            | "closed"
            | "cancelled"
            work_order_type: "preventive" | "corrective" | "inspection" | "project"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
}
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
    public: {
        Enums: {
            alert_status: ["new", "acknowledged", "resolved"],
            asset_lifecycle_phase: [
                "planning",
                "acquisition",
                "operation",
                "maintenance",
                "disposal",
            ],
            criticality_level: ["low", "medium", "high", "critical"],
            decision_status: [
                "proposed",
                "analyzing",
                "approved",
                "rejected",
                "deferred",
            ],
            decision_type: ["capex", "opex", "disposal", "replacement", "expansion"],
            movement_type: ["inbound", "outbound_wo", "adjustment", "return"],
            user_role: [
                "technician",
                "planner",
                "supervisor",
                "warehouse",
                "industrial_read_only",
                "admin",
            ],
            work_order_priority: ["low", "medium", "high", "emergency"],
            work_order_status: [
                "draft",
                "assigned",
                "kit_requested",
                "kit_ready",
                "in_progress",
                "completed",
                "verified",
                "closed",
                "cancelled",
            ],
            work_order_type: ["preventive", "corrective", "inspection", "project"],
        },
    },
} as const
