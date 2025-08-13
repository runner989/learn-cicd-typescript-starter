import { describe, it, expect } from "vitest";
import { getAPIKey } from "../api/auth";
import { IncomingHttpHeaders } from "http";

describe("getAPIKey", () => {
  it("should return null when no authorization header is present", () => {
    const headers: IncomingHttpHeaders = {};
    const result = getAPIKey(headers);
    expect(result).toBeNull();
  });

  it("should return null when authorization header is empty string", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "",
    };
    const result = getAPIKey(headers);
    expect(result).toBeNull();
  });

  it("should return null when authorization header has wrong format (single word)", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "justoneword",
    };
    const result = getAPIKey(headers);
    expect(result).toBeNull();
  });

  it("should return null when authorization type is not ApiKey", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "Bearer token123",
    };
    const result = getAPIKey(headers);
    expect(result).toBeNull();
  });

  it("should return null when authorization type is lowercase apikey", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "apikey token123",
    };
    const result = getAPIKey(headers);
    expect(result).toBeNull();
  });

  it("should return the API key when authorization header is properly formatted", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKey my-secret-key-123",
    };
    const result = getAPIKey(headers);
    expect(result).toBe("my-secret-key-123");
  });

  it("should handle API keys with special characters", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKey abc!@#$%^&*()_+-=[]{}|;:,.<>?",
    };
    const result = getAPIKey(headers);
    expect(result).toBe("abc!@#$%^&*()_+-=[]{}|;:,.<>?");
  });

  it("should return null when ApiKey prefix is present but no key follows", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKey",
    };
    const result = getAPIKey(headers);
    expect(result).toBeNull();
  });

  it("should return null when ApiKey prefix has trailing space but no key", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKey ",
    };
    const result = getAPIKey(headers);
    expect(result).toBe("");
  });

  it("should handle multiple spaces between ApiKey and the token", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKey   token123",
    };
    const result = getAPIKey(headers);
    expect(result).toBe("");
  });

  it("should preserve spaces within the API key itself", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKey key with spaces",
    };
    const result = getAPIKey(headers);
    expect(result).toBe("key");
  });

  it("should handle authorization header regardless of header case", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKey uppercase-header-key",
    };
    const result = getAPIKey(headers);
    expect(result).toBe("uppercase-header-key");
  });
});
