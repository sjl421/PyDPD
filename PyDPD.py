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

def countLOC(fileLines):
  """
  Counts the lines of code that are not comments.

  :param fileLines: The lines of the file to count the source code of.
  :type fileLines: List[str]
  :returns: int - The number of lines of code that are not comments.
  """
  LOC = 0
  lines = getFileLines(filename)
  for line in lines:
    strippedLine = line.strip()
    # Check to make sure that the current line is not a comment or blank line.
    if    not strippedLine \
      and not strippedLine.startsWith('//') \
      and not strippedLine.startsWith('/*') \
      and not strippedLine.startsWith('#') \
      and not strippedLine.startsWith('"""'):
        LOC += 1
  return LOC
