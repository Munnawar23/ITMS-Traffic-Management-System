export const getGreeting = (t: any): string => {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return t("common.goodMorning") || "Good Morning";
  }
  if (hour < 17) {
    return t("common.goodAfternoon") || "Good Afternoon";
  }
  return t("common.goodEvening") || "Good Evening";
};

export const formatDate = (date: Date = new Date()): string => {
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const formatTime = (date: Date = new Date()): string => {
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};
