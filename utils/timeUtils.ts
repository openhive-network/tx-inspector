import moment from 'moment';

export const convertUTCDateToLocalDate = (date: string | Date) => {
  const newDate = new Date(date);

  return formatAndDelocalizeTime(newDate);
};

export const formatAndDelocalizeTime = (date?: string | Date): string => {
  if (!date) return '';

  return moment(date).format('YYYY/MM/DD HH:mm:ss UTC');
};
