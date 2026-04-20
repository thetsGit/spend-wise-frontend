/**
 * Specially treated 'chars' during parsing
 */

const NEWLINE_LF = "\n";
const DELIMITER = ",";
const DOUBLE_QUOTE = `"`;

/**
 * Parsing state machine - states
 */
const NORMAL_STATE = "normal"; // Reading a plain field
const QUOTED_STATE = "quoted"; // Inside a quoted field
const QNQ_STATE = "quote-in-quote"; // Encounter a closing quote inside quoted field

export const parsingStates = [NORMAL_STATE, QUOTED_STATE, QNQ_STATE] as const;
export type ParsingState = (typeof parsingStates)[number];

export const parseCSV = (content: string) => {
  // Trimmed 'content' and handle empty case
  const trimmedContent = content.trim();
  if (!trimmedContent.length) {
    return null;
  }

  // Normalize 'content' for parsing efficiency
  const normalizedContent = trimmedContent.replaceAll(
    /(\r\n|\n|\r)/gm,
    NEWLINE_LF,
  );

  const records: string[][] = [];
  let parsingState = NORMAL_STATE;
  let currentFields: string[] = [];
  let currentBuffer = "";

  /**
   * Helpers
   */

  const emitCurrentField = () => {
    currentFields.push(currentBuffer);

    // Flush 'currentBuffer'
    currentBuffer = "";
  };

  const emitCurrentRecord = () => {
    emitCurrentField();

    records.push(currentFields);

    // Flush 'currentFields'
    currentFields = [];
  };

  /**
   * Perform parsing char by char
   */

  for (const char of normalizedContent) {
    switch (parsingState) {
      case NORMAL_STATE:
        if (char === DELIMITER) {
          emitCurrentField();
        } else if (char === DOUBLE_QUOTE) {
          parsingState = QUOTED_STATE;
        } else if (char === NEWLINE_LF) {
          emitCurrentRecord();
        } else {
          currentBuffer += char;
        }
        break;
      case QUOTED_STATE:
        if (char === DOUBLE_QUOTE) {
          parsingState = QNQ_STATE;
        } else {
          currentBuffer += char;
        }
        break;
      case QNQ_STATE:
        if (char === DOUBLE_QUOTE) {
          currentBuffer += char;
          parsingState = QUOTED_STATE;
        } else if (char === DELIMITER) {
          emitCurrentField();
          parsingState = NORMAL_STATE;
        } else if (char === NEWLINE_LF) {
          emitCurrentRecord();
          parsingState = NORMAL_STATE;
        }
        break;
      default:
        break;
    }
  }

  // Handle the Last record (because 'DELIMITER' were trimmed at both ends before parsing)
  if (currentBuffer.length > 0 || currentFields.length > 0) {
    emitCurrentRecord();
  }

  const headers = records.shift();

  if (headers?.length === 0) {
    throw new Error("No headers found");
  }

  const recordsMap = records.map((record) => {
    return record.reduce(
      (recordMap, current, idx) => {
        recordMap[headers![idx]] = current;
        return recordMap;
      },
      {} as Record<string, string>,
    );
  });

  return { headers, records: recordsMap };
};
