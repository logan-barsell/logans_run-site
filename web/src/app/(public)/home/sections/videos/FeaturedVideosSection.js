import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFeaturedVideos } from '../../../../../redux/actions';
import VideoCarousel from '../../../../../components/Carousels/VideoCarousel';
import StaticAlert from '../../../../../components/Alert/StaticAlert';
import { PageLoader } from '../../../../../components/LoadingSpinner';

export default function FeaturedVideosSection() {
  const dispatch = useDispatch();
  const featuredVideos = useSelector(state => state.featuredVideos?.data || []);
  const loading = useSelector(state => state.featuredVideos?.loading || false);
  const error = useSelector(state => state.featuredVideos?.error || null);

  useEffect(() => {
    dispatch(fetchFeaturedVideos());
  }, [dispatch]);

  // Transform featured videos data for VideoCarousel
  const transformFeaturedVideos = videos => {
    if (!videos || videos.length === 0) return [];

    // Sort by releaseDate descending (newest first)
    const sorted = videos.sort(
      (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
    );

    // Map API data to VideoCarousel format
    return sorted.map(v => {
      // Extract videoId from youtubeLink (supports full URL or share link)
      let videoId = '';
      try {
        const url = new URL(v.youtubeLink);
        if (url.hostname.includes('youtu.be')) {
          videoId = url.pathname.replace('/', '');
        } else if (url.hostname.includes('youtube.com')) {
          const params = new URLSearchParams(url.search);
          videoId = params.get('v');
        }
      } catch {
        // fallback: try to parse as ID
        videoId = v.youtubeLink;
      }
      return {
        id: v.id,
        videoId,
        videoType: v.videoType || 'YOUTUBE',
        displayMode: v.displayMode || 'FULL',
        videoFile: v.videoFile,
        videoThumbnail: v.videoThumbnail,
        youtubeLink: v.youtubeLink,
        title: v.title,
        description: v.description,
        startTime:
          v.startTime !== undefined &&
          v.startTime !== null &&
          v.startTime !== ''
            ? Number(v.startTime)
            : undefined,
        endTime:
          v.endTime !== undefined && v.endTime !== null && v.endTime !== ''
            ? Number(v.endTime)
            : undefined,
      };
    });
  };

  // Show loading state
  if (loading) {
    return <PageLoader />;
  }

  // Show error state
  if (error) {
    return (
      <StaticAlert
        type={error.severity}
        title={error.title}
        description={error.message}
      />
    );
  }

  const transformedVideos = transformFeaturedVideos(featuredVideos);

  // Show videos if we have any
  if (transformedVideos.length > 0) {
    return <VideoCarousel videos={transformedVideos} />;
  }

  // No videos available
  return null;
}
