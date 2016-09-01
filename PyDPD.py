import os.path

def getFileLines(filename):
  """
  Returns the lines from a file as a list.

  :param filename: The file name of the file to get the lines of.
  :type filename: str
  :returns: List[str] - A list of strings where each string represents a line
    in the file.
  """
  file = open(filename)
  lines = file.readlines()
  file.close()
  return lines

def countLOC(filename):
  """
  Counts the lines of code that are not comments.

  :param fileLines: The lines of the file to count the source code of.
  :type fileLines: List[str]
  :returns: int - The number of lines of code that are not comments.
  """
  # First get the file extension since it comes in handy later on.
  extension = os.path.splitext(filename)[1]

  LOC = 0
  lines = getFileLines(filename)
  readingBlockComment = False # This flag will be updated in the loop below.
  for line in lines:
    strippedLine = line.strip()
    # Check to make sure that the current line is not single line comment or
    # blank line.
    if strippedLine \
      and not strippedLine.startswith('//') \
      and not (strippedLine.startswith('#') and extension != '.cpp') \
      and not strippedLine.startswith('"""'):
        # Check to make sure that the code is not currently reading a block
        # comment. Increment LOC count if it's not.
        if not readingBlockComment:
          if strippedLine.startswith('/*'):
            readingBlockComment = True
            if '*/' in strippedLine:
              readingBlockComment = False
              # If a comment block has ended, and there is code after it, then 
              # it should still add to the LOC count.
              if strippedLine.find('*/') <= len(strippedLine) - 3:
                LOC += 1
          else:
            LOC += 1
        else:
          if '*/' in strippedLine:
            readingBlockComment = False
            # If a comment block has ended, and there is code after it, then it
            # should still add to the LOC count.
            if strippedLine.find('*/') <= len(strippedLine) - 3:
              LOC += 1
  return LOC

countLOC('UnitTestData/JS-Dataset-Parser.js')
