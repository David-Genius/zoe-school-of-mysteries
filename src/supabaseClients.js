// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dyhjmpssgvdlpzbsfiff.supabase.co";
const supabaseKey = "sb_publishable_EWuY7r16SdI-vM7jU5zcsA_0tyPI2m7";

export const supabase = createClient(supabaseUrl, supabaseKey);


