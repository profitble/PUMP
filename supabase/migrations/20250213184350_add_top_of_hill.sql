ALTER TABLE "public"."listed_tokens"
ADD COLUMN "TOP_OF_THE_HILL" boolean DEFAULT false;

-- Add a constraint to ensure only one token can be at the top of the hill
CREATE OR REPLACE FUNCTION ensure_single_top_of_hill()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW."TOP_OF_THE_HILL" = true THEN
        UPDATE "public"."listed_tokens"
        SET "TOP_OF_THE_HILL" = false
        WHERE id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER single_top_of_hill
    BEFORE INSERT OR UPDATE ON "public"."listed_tokens"
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_top_of_hill();