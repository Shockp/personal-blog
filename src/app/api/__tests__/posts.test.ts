import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { NextRequest } from 'next/server';
import { GET } from '../posts/[slug]/route';

// Mock the posts library
const mockGetPostBySlug = jest.fn();
const mockGetAllPosts = jest.fn();

jest.mock('@/lib/posts', () => ({
  getPostBySlug: mockGetPostBySlug,
  getAllPosts: mockGetAllPosts,
}));

// Mock NextResponse
const mockJson = jest.fn();
const MockNextResponse = {
  json: mockJson,
};

jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: MockNextResponse,
}));

// Sample test data
const mockPost = {
  slug: 'test-post',
  title: 'Test Post',
  description: 'A test post description',
  content: 'Test content',
  date: '2024-01-01',
  author: 'Test Author',
  tags: ['test', 'blog'],
  readingTime: 5,
  image: '/test-image.jpg',
};

const mockAllPosts = [
  {
    slug: 'first-post',
    title: 'First Post',
    description: 'First post description',
    date: '2024-01-01',
    author: 'Test Author',
    tags: ['first', 'blog'],
    readingTime: 3,
  },
  {
    slug: 'test-post',
    title: 'Test Post',
    description: 'A test post description',
    date: '2024-01-02',
    author: 'Test Author',
    tags: ['test', 'blog'],
    readingTime: 5,
  },
  {
    slug: 'third-post',
    title: 'Third Post',
    description: 'Third post description',
    date: '2024-01-03',
    author: 'Test Author',
    tags: ['third', 'blog'],
    readingTime: 4,
  },
  {
    slug: 'related-post',
    title: 'Related Post',
    description: 'Related post description',
    date: '2024-01-04',
    author: 'Test Author',
    tags: ['test', 'related'],
    readingTime: 6,
  },
];

describe('Posts API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockJson.mockImplementation((data, options) => ({
      json: () => Promise.resolve(data),
      status: options?.status || 200,
      ...options,
    }));
  });

  describe('GET /api/posts/[slug]', () => {
    it('should return post data with related posts and navigation', async () => {
      mockGetPostBySlug.mockResolvedValue(mockPost);
      mockGetAllPosts.mockResolvedValue(mockAllPosts);

      const request = new NextRequest('http://localhost:3000/api/posts/test-post');
      const params = Promise.resolve({ slug: 'test-post' });

      const response = await GET(request, { params });

      expect(mockGetPostBySlug).toHaveBeenCalledWith('test-post');
      expect(mockGetAllPosts).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith({
        post: mockPost,
        relatedPosts: [{
          slug: 'related-post',
          title: 'Related Post',
          description: 'Related post description',
          date: '2024-01-04',
          author: 'Test Author',
          tags: ['test', 'related'],
          readingTime: 6,
        }],
        previousPost: {
          slug: 'first-post',
          title: 'First Post',
          description: 'First post description',
          date: '2024-01-01',
          author: 'Test Author',
          tags: ['first', 'blog'],
          readingTime: 3,
        },
        nextPost: {
          slug: 'third-post',
          title: 'Third Post',
          description: 'Third post description',
          date: '2024-01-03',
          author: 'Test Author',
          tags: ['third', 'blog'],
          readingTime: 4,
        },
      });
    });

    it('should return 400 when slug is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/posts/');
      const params = Promise.resolve({ slug: '' });

      const response = await GET(request, { params });

      expect(mockJson).toHaveBeenCalledWith(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    });

    it('should return 404 when post is not found', async () => {
      mockGetPostBySlug.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/posts/nonexistent');
      const params = Promise.resolve({ slug: 'nonexistent' });

      const response = await GET(request, { params });

      expect(mockGetPostBySlug).toHaveBeenCalledWith('nonexistent');
      expect(mockJson).toHaveBeenCalledWith(
        { error: 'Post not found' },
        { status: 404 }
      );
    });

    it('should handle navigation for first post', async () => {
      const firstPost = { ...mockPost, slug: 'first-post' };
      mockGetPostBySlug.mockResolvedValue(firstPost);
      mockGetAllPosts.mockResolvedValue(mockAllPosts);

      const request = new NextRequest('http://localhost:3000/api/posts/first-post');
      const params = Promise.resolve({ slug: 'first-post' });

      const response = await GET(request, { params });

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          previousPost: null,
          nextPost: expect.objectContaining({ slug: 'test-post' }),
        })
      );
    });

    it('should handle navigation for last post', async () => {
      const lastPost = { ...mockPost, slug: 'related-post' };
      mockGetPostBySlug.mockResolvedValue(lastPost);
      mockGetAllPosts.mockResolvedValue(mockAllPosts);

      const request = new NextRequest('http://localhost:3000/api/posts/related-post');
      const params = Promise.resolve({ slug: 'related-post' });

      const response = await GET(request, { params });

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          previousPost: expect.objectContaining({ slug: 'third-post' }),
          nextPost: null,
        })
      );
    });

    it('should find related posts based on tags', async () => {
      mockGetPostBySlug.mockResolvedValue(mockPost);
      mockGetAllPosts.mockResolvedValue(mockAllPosts);

      const request = new NextRequest('http://localhost:3000/api/posts/test-post');
      const params = Promise.resolve({ slug: 'test-post' });

      const response = await GET(request, { params });

      const callArgs = mockJson.mock.calls[0][0];
      expect(callArgs.relatedPosts).toHaveLength(1);
      expect(callArgs.relatedPosts[0].slug).toBe('related-post');
      expect(callArgs.relatedPosts[0].tags).toContain('test');
    });

    it('should limit related posts to 4', async () => {
      const manyRelatedPosts = [
        ...mockAllPosts,
        { slug: 'related-1', title: 'Related 1', tags: ['test'], date: '2024-01-05', author: 'Author', description: 'Desc', readingTime: 3 },
        { slug: 'related-2', title: 'Related 2', tags: ['test'], date: '2024-01-06', author: 'Author', description: 'Desc', readingTime: 3 },
        { slug: 'related-3', title: 'Related 3', tags: ['test'], date: '2024-01-07', author: 'Author', description: 'Desc', readingTime: 3 },
        { slug: 'related-4', title: 'Related 4', tags: ['test'], date: '2024-01-08', author: 'Author', description: 'Desc', readingTime: 3 },
        { slug: 'related-5', title: 'Related 5', tags: ['test'], date: '2024-01-09', author: 'Author', description: 'Desc', readingTime: 3 },
      ];

      mockGetPostBySlug.mockResolvedValue(mockPost);
      mockGetAllPosts.mockResolvedValue(manyRelatedPosts);

      const request = new NextRequest('http://localhost:3000/api/posts/test-post');
      const params = Promise.resolve({ slug: 'test-post' });

      const response = await GET(request, { params });

      const callArgs = mockJson.mock.calls[0][0];
      expect(callArgs.relatedPosts).toHaveLength(4);
    });

    it('should exclude current post from related posts', async () => {
      mockGetPostBySlug.mockResolvedValue(mockPost);
      mockGetAllPosts.mockResolvedValue(mockAllPosts);

      const request = new NextRequest('http://localhost:3000/api/posts/test-post');
      const params = Promise.resolve({ slug: 'test-post' });

      const response = await GET(request, { params });

      const callArgs = mockJson.mock.calls[0][0];
      const relatedSlugs = callArgs.relatedPosts.map((p: any) => p.slug);
      expect(relatedSlugs).not.toContain('test-post');
    });

    it('should handle posts with no related posts', async () => {
      const uniquePost = { ...mockPost, tags: ['unique'] };
      mockGetPostBySlug.mockResolvedValue(uniquePost);
      mockGetAllPosts.mockResolvedValue(mockAllPosts);

      const request = new NextRequest('http://localhost:3000/api/posts/test-post');
      const params = Promise.resolve({ slug: 'test-post' });

      const response = await GET(request, { params });

      const callArgs = mockJson.mock.calls[0][0];
      expect(callArgs.relatedPosts).toHaveLength(0);
    });

    it('should handle single post in collection', async () => {
      const singlePost = [mockAllPosts[1]]; // Just the test post
      mockGetPostBySlug.mockResolvedValue(mockPost);
      mockGetAllPosts.mockResolvedValue(singlePost);

      const request = new NextRequest('http://localhost:3000/api/posts/test-post');
      const params = Promise.resolve({ slug: 'test-post' });

      const response = await GET(request, { params });

      const callArgs = mockJson.mock.calls[0][0];
      expect(callArgs.previousPost).toBeNull();
      expect(callArgs.nextPost).toBeNull();
      expect(callArgs.relatedPosts).toHaveLength(0);
    });

    it('should return 500 on getPostBySlug error', async () => {
      mockGetPostBySlug.mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/posts/test-post');
      const params = Promise.resolve({ slug: 'test-post' });

      const response = await GET(request, { params });

      expect(mockJson).toHaveBeenCalledWith(
        { error: 'Internal server error' },
        { status: 500 }
      );
    });

    it('should return 500 on getAllPosts error', async () => {
      mockGetPostBySlug.mockResolvedValue(mockPost);
      mockGetAllPosts.mockRejectedValue(new Error('File system error'));

      const request = new NextRequest('http://localhost:3000/api/posts/test-post');
      const params = Promise.resolve({ slug: 'test-post' });

      const response = await GET(request, { params });

      expect(mockJson).toHaveBeenCalledWith(
        { error: 'Internal server error' },
        { status: 500 }
      );
    });

    it('should handle params promise rejection', async () => {
      const request = new NextRequest('http://localhost:3000/api/posts/test-post');
      const params = Promise.reject(new Error('Params error'));

      const response = await GET(request, { params });

      expect(mockJson).toHaveBeenCalledWith(
        { error: 'Internal server error' },
        { status: 500 }
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle undefined slug gracefully', async () => {
      const request = new NextRequest('http://localhost:3000/api/posts/');
      const params = Promise.resolve({ slug: undefined as any });

      const response = await GET(request, { params });

      expect(mockJson).toHaveBeenCalledWith(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    });

    it('should handle null slug gracefully', async () => {
      const request = new NextRequest('http://localhost:3000/api/posts/');
      const params = Promise.resolve({ slug: null as any });

      const response = await GET(request, { params });

      expect(mockJson).toHaveBeenCalledWith(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    });

    it('should handle empty posts array', async () => {
      mockGetPostBySlug.mockResolvedValue(mockPost);
      mockGetAllPosts.mockResolvedValue([]);

      const request = new NextRequest('http://localhost:3000/api/posts/test-post');
      const params = Promise.resolve({ slug: 'test-post' });

      const response = await GET(request, { params });

      const callArgs = mockJson.mock.calls[0][0];
      expect(callArgs.relatedPosts).toHaveLength(0);
      expect(callArgs.previousPost).toBeNull();
      expect(callArgs.nextPost).toBeNull();
    });
  });

  describe('Performance', () => {
    it('should call functions in correct order', async () => {
      const callOrder: string[] = [];
      
      mockGetPostBySlug.mockImplementation(async (slug) => {
        callOrder.push('getPostBySlug');
        return mockPost;
      });
      
      mockGetAllPosts.mockImplementation(async () => {
        callOrder.push('getAllPosts');
        return mockAllPosts;
      });

      const request = new NextRequest('http://localhost:3000/api/posts/test-post');
      const params = Promise.resolve({ slug: 'test-post' });

      await GET(request, { params });

      expect(callOrder).toEqual(['getPostBySlug', 'getAllPosts']);
    });

    it('should not call getAllPosts if post not found', async () => {
      mockGetPostBySlug.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/posts/nonexistent');
      const params = Promise.resolve({ slug: 'nonexistent' });

      await GET(request, { params });

      expect(mockGetPostBySlug).toHaveBeenCalled();
      expect(mockGetAllPosts).not.toHaveBeenCalled();
    });
  });
});