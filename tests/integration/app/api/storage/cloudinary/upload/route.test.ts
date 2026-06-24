import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const cloudinaryMock = vi.hoisted(() => ({
  config: vi.fn(),
  uploadStream: vi.fn(),
  destroy: vi.fn(),
}));

vi.mock("cloudinary", () => ({
  v2: {
    config: cloudinaryMock.config,
    uploader: {
      upload_stream: cloudinaryMock.uploadStream,
      destroy: cloudinaryMock.destroy,
    },
  },
}));

vi.mock("@/lib/auth-helpers", () => ({
  requireAdminAuth: vi.fn(),
}));

import { DELETE, POST } from "@/app/api/storage/cloudinary/upload/route";
import {
  createCloudinaryDestroyResult,
  createCloudinaryUploadResult,
  createProviderTimeoutError,
} from "@/tests/helpers/providers";

function createUploadRequest() {
  const formData = new FormData();
  formData.set(
    "file",
    new File(["mock-image"], "poster.jpg", { type: "image/jpeg" })
  );
  formData.set("eventId", "event_123");
  formData.set("mediaType", "IMAGE");

  return new NextRequest("http://localhost/api/storage/cloudinary/upload", {
    method: "POST",
    body: formData,
  });
}

function mockUploadCallback(
  result: Record<string, unknown> | null,
  error: Error | null = null
) {
  cloudinaryMock.uploadStream.mockImplementationOnce(
    (_options: unknown, callback: (err: Error | null, value: unknown) => void) =>
      ({
        end: () => callback(error, result),
      })
  );
}

describe("Cloudinary upload route mocks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses mocked Cloudinary upload success responses", async () => {
    mockUploadCallback(createCloudinaryUploadResult());

    const response = await POST(createUploadRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      url: "https://res.cloudinary.com/demo/image/upload/v1/mock-image.jpg",
      publicId: "cksi/events/event_123/images/mock-image",
      resourceType: "image",
    });
  });

  it("covers mocked Cloudinary timeout errors", async () => {
    mockUploadCallback(
      null,
      createProviderTimeoutError("Cloudinary upload timed out")
    );

    const response = await POST(createUploadRequest());

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Cloudinary upload timed out",
    });
  });

  it("covers mocked invalid Cloudinary upload payloads", async () => {
    mockUploadCallback({});

    const response = await POST(createUploadRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.publicId).toBeUndefined();
    expect(body.url).toBeUndefined();
  });

  it("covers mocked Cloudinary delete failures", async () => {
    cloudinaryMock.destroy.mockRejectedValueOnce(new Error("Delete failed"));

    const response = await DELETE(
      new NextRequest(
        "http://localhost/api/storage/cloudinary/upload?publicId=mock-image&resourceType=image",
        {
          method: "DELETE",
        }
      )
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Delete failed",
    });
  });

  it("uses mocked Cloudinary delete success responses", async () => {
    cloudinaryMock.destroy.mockResolvedValueOnce(
      createCloudinaryDestroyResult()
    );

    const response = await DELETE(
      new NextRequest(
        "http://localhost/api/storage/cloudinary/upload?publicId=mock-image&resourceType=image",
        {
          method: "DELETE",
        }
      )
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      result: { result: "ok" },
    });
  });
});
