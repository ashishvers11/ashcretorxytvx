// ==============================================================================
// ASH CREATOR STUDIO — Official YouTube Analytics API Client
// Endpoint: https://youtubeanalytics.googleapis.com/v2/reports
// ==============================================================================

export interface DailyAnalyticsRecord {
  date: string;
  views: number;
  estimatedMinutesWatched: number;
  averageViewDurationSeconds: number;
  subscribersGained: number;
  subscribersLost: number;
  netSubscribers: number;
  likes: number;
  comments: number;
  shares: number;
  isAuthorized: boolean;
}

export interface VideoAnalyticsRecord {
  videoId: string;
  title?: string;
  views: number;
  estimatedMinutesWatched: number;
  averageViewDurationSeconds: number;
  likes: number;
  comments?: number;
  publishedAt?: string;
  subscribersGained: number;
}

export interface ChannelAnalyticsReport {
  startDate: string;
  endDate: string;
  dailyRows: DailyAnalyticsRecord[];
  totals: {
    views: number;
    estimatedMinutesWatched: number;
    watchTimeHours: number;
    subscribersGained: number;
    subscribersLost: number;
    netSubscribers: number;
    likes: number;
    comments: number;
    shares: number;
    averageViewDurationSeconds: number;
  };
  topVideos: VideoAnalyticsRecord[];
  isAuthorized: boolean;
  reportingDelayNote?: string;
}

/**
 * Calculates start and end dates formatted as YYYY-MM-DD for given range in days
 */
export function getDateRange(days: 7 | 28 | 90): { startDate: string; endDate: string } {
  const now = new Date();
  // YouTube Analytics typically has a 48h latency delay, so endDate is 2 days ago
  const end = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const start = new Date(end.getTime() - (days - 1) * 24 * 60 * 60 * 1000);

  const format = (d: Date) => d.toISOString().split("T")[0];

  return {
    startDate: format(start),
    endDate: format(end),
  };
}

/**
 * Calls official YouTube Analytics API to fetch authenticated channel report
 * Endpoint: GET https://youtubeanalytics.googleapis.com/v2/reports
 */
export async function fetchOfficialYouTubeAnalytics(
  accessToken: string,
  options: {
    startDate: string;
    endDate: string;
    channelId?: string;
  }
): Promise<ChannelAnalyticsReport> {
  const { startDate, endDate, channelId } = options;

  const url = new URL("https://youtubeanalytics.googleapis.com/v2/reports");
  url.searchParams.set("ids", channelId ? `channel==${channelId}` : "channel==MINE");
  url.searchParams.set("startDate", startDate);
  url.searchParams.set("endDate", endDate);
  url.searchParams.set(
    "metrics",
    "views,estimatedMinutesWatched,averageViewDuration,subscribersGained,subscribersLost,likes,comments,shares"
  );
  url.searchParams.set("dimensions", "day");
  url.searchParams.set("sort", "day");

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data.error?.message || "YouTube Analytics API error.";
    throw new Error(`YouTube Analytics API Error: ${errorMsg}`);
  }

  // Parse column headers
  const columnHeaders: string[] = (data.columnHeaders || []).map((h: any) => h.name);
  const rows: any[][] = data.rows || [];

  const getColIndex = (name: string) => columnHeaders.indexOf(name);
  const idxDay = getColIndex("day");
  const idxViews = getColIndex("views");
  const idxMinutes = getColIndex("estimatedMinutesWatched");
  const idxAvgDuration = getColIndex("averageViewDuration");
  const idxSubsGained = getColIndex("subscribersGained");
  const idxSubsLost = getColIndex("subscribersLost");
  const idxLikes = getColIndex("likes");
  const idxComments = getColIndex("comments");
  const idxShares = getColIndex("shares");

  let totalViews = 0;
  let totalMinutes = 0;
  let totalSubsGained = 0;
  let totalSubsLost = 0;
  let totalLikes = 0;
  let totalComments = 0;
  let totalShares = 0;

  const dailyRows: DailyAnalyticsRecord[] = rows.map((r) => {
    const views = r[idxViews] || 0;
    const minutes = r[idxMinutes] || 0;
    const avgDuration = r[idxAvgDuration] || 0;
    const subsGained = r[idxSubsGained] || 0;
    const subsLost = r[idxSubsLost] || 0;
    const likes = r[idxLikes] || 0;
    const comments = r[idxComments] || 0;
    const shares = r[idxShares] || 0;

    totalViews += views;
    totalMinutes += minutes;
    totalSubsGained += subsGained;
    totalSubsLost += subsLost;
    totalLikes += likes;
    totalComments += comments;
    totalShares += shares;

    return {
      date: r[idxDay] || "",
      views,
      estimatedMinutesWatched: minutes,
      averageViewDurationSeconds: avgDuration,
      subscribersGained: subsGained,
      subscribersLost: subsLost,
      netSubscribers: subsGained - subsLost,
      likes,
      comments,
      shares,
      isAuthorized: true,
    };
  });

  const avgDurationOverall = totalViews > 0 ? Math.round((totalMinutes * 60) / totalViews) : 0;

  // 2. Fetch top videos breakdown
  let topVideos: VideoAnalyticsRecord[] = [];
  try {
    const topUrl = new URL("https://youtubeanalytics.googleapis.com/v2/reports");
    topUrl.searchParams.set("ids", channelId ? `channel==${channelId}` : "channel==MINE");
    topUrl.searchParams.set("startDate", startDate);
    topUrl.searchParams.set("endDate", endDate);
    topUrl.searchParams.set(
      "metrics",
      "views,estimatedMinutesWatched,averageViewDuration,likes,subscribersGained"
    );
    topUrl.searchParams.set("dimensions", "video");
    topUrl.searchParams.set("sort", "-views");
    topUrl.searchParams.set("maxResults", "10");

    const topRes = await fetch(topUrl.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (topRes.ok) {
      const topData = await topRes.json();
      const topCols = (topData.columnHeaders || []).map((h: any) => h.name);
      const topRows: any[][] = topData.rows || [];

      const vIdxVideo = topCols.indexOf("video");
      const vIdxViews = topCols.indexOf("views");
      const vIdxMin = topCols.indexOf("estimatedMinutesWatched");
      const vIdxAvg = topCols.indexOf("averageViewDuration");
      const vIdxLikes = topCols.indexOf("likes");
      const vIdxSubs = topCols.indexOf("subscribersGained");

      topVideos = topRows.map((r) => ({
        videoId: r[vIdxVideo] || "",
        views: r[vIdxViews] || 0,
        estimatedMinutesWatched: r[vIdxMin] || 0,
        averageViewDurationSeconds: r[vIdxAvg] || 0,
        likes: r[vIdxLikes] || 0,
        subscribersGained: r[vIdxSubs] || 0,
      }));
    }
  } catch (err) {
    console.warn("Could not fetch top video analytics:", err);
  }

  return {
    startDate,
    endDate,
    dailyRows,
    totals: {
      views: totalViews,
      estimatedMinutesWatched: totalMinutes,
      watchTimeHours: Number((totalMinutes / 60).toFixed(2)),
      subscribersGained: totalSubsGained,
      subscribersLost: totalSubsLost,
      netSubscribers: totalSubsGained - totalSubsLost,
      likes: totalLikes,
      comments: totalComments,
      shares: totalShares,
      averageViewDurationSeconds: avgDurationOverall,
    },
    topVideos,
    isAuthorized: true,
    reportingDelayNote: "Data reflects official YouTube Analytics with 48h aggregation delay.",
  };
}
