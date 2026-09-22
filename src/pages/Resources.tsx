import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'

import {
  getTasks,
} from '../api/services/taskService'

import type { Task } from '../api/services/taskService'

import {
  getAttachments,
  downloadAttachment,
  deleteAttachment,
  uploadAttachment,
} from '../api/services/AttachmentsService'

import type {
  Attachment,
} from '../api/services/AttachmentsService'

const formatFileSize = (
  sizeBytes?: number | null
): string => {
  if (!sizeBytes) {
    return '0 B'
  }

  if (sizeBytes < 1024) {
    return `${sizeBytes} B`
  }

  if (sizeBytes < 1024 * 1024) {
    return `${(sizeBytes / 1024).toFixed(1)} KB`
  }

  return `${(
    sizeBytes /
    (1024 * 1024)
  ).toFixed(1)} MB`
}

const getFileExtension = (
  filename: string
): string => {
  const extension =
    filename.split('.').pop()

  return extension
    ? extension.toUpperCase()
    : 'FILE'
}

import { usePageView } from '../api/hooks/usePageView'


function Resources() {

  usePageView('Resources')
  
  const [attachments, setAttachments] =
    useState<Attachment[]>([])

    const [tasks, setTasks] = useState<Task[]>([])
const [uploadOpen, setUploadOpen] = useState(false)
const [selectedTaskId, setSelectedTaskId] = useState('')
const [selectedUploadFile, setSelectedUploadFile] =
  useState<File | null>(null)
const [uploading, setUploading] = useState(false)
const [uploadError, setUploadError] = useState('')


  const [searchTerm, setSearchTerm] =
  useState('')

  const [fileType, setFileType] =
  useState('all')

  const [sortBy, setSortBy] =
  useState('newest')

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const [downloadingId, setDownloadingId] =
    useState<string | null>(null)

  const [deletingId, setDeletingId] =
    useState<string | null>(null)

    const handleUpload = async () => {
  if (!selectedTaskId) {
    setUploadError('Please select a task.')
    return
  }

  if (!selectedUploadFile) {
    setUploadError('Please select a file.')
    return
  }

  setUploading(true)
  setUploadError('')

  try {
    const uploadedAttachment = await uploadAttachment({
      taskId: selectedTaskId,
      file: selectedUploadFile,
    })

    setAttachments((previous) => [
      uploadedAttachment,
      ...previous,
    ])

    setUploadOpen(false)
    setSelectedTaskId('')
    setSelectedUploadFile(null)
  } catch (err) {
    console.error('Resource upload failed:', err)
    setUploadError('Unable to upload the resource.')
  } finally {
    setUploading(false)
  }
}

  useEffect(() => {
  const loadResources = async () => {
    setLoading(true)
    setError('')

    try {
      const [attachmentsData, tasksData] =
        await Promise.all([
          getAttachments(),
          getTasks(),
        ])

      setAttachments(attachmentsData)
      setTasks(tasksData)
    } catch (err) {
      console.error('Failed to load resources:', err)
      setError('Unable to load resources.')
    } finally {
      setLoading(false)
    }
  }

  loadResources()
}, [])

  const handleDownload = async (
    attachment: Attachment
  ) => {
    try {
      setDownloadingId(attachment.id)

      const blob =
        await downloadAttachment(
          attachment.id
        )

      const url =
        window.URL.createObjectURL(blob)

      const link =
        document.createElement('a')

      link.href = url
      link.download = attachment.filename

      document.body.appendChild(link)

      link.click()

      link.remove()

      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(
        'Failed to download attachment:',
        err
      )
    } finally {
      setDownloadingId(null)
    }
  }

  const handleDelete = async (
    attachment: Attachment
  ) => {
    const confirmed =
      window.confirm(
        `Delete "${attachment.filename}"?`
      )

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(attachment.id)

      await deleteAttachment(
        attachment.id
      )

      setAttachments(
        (currentAttachments) =>
          currentAttachments.filter(
            (item) =>
              item.id !== attachment.id
          )
      )
    } catch (err) {
      console.error(
        'Failed to delete attachment:',
        err
      )
    } finally {
      setDeletingId(null)
    }
  }

    const filteredAttachments =
  attachments
    .filter((attachment) => {
      const matchesSearch =
        attachment.filename
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )

      const extension =
        getFileExtension(
          attachment.filename
        ).toLowerCase()

      const matchesType =
        fileType === 'all' ||
        extension === fileType


      return (
        matchesSearch &&
        matchesType
      )
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return (
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        )
      }

      if (sortBy === 'oldest') {
        return (
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
        )
      }

      if (sortBy === 'nameAsc') {
        return a.filename.localeCompare(
          b.filename
        )
      }

      if (sortBy === 'nameDesc') {
        return b.filename.localeCompare(
          a.filename
        )
      }

      return 0
    })
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, md: 4 },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: {
            xs: 'flex-start',
            sm: 'center',
          },
          gap: 2,
          flexDirection: {
            xs: 'column',
            sm: 'row',
          },
        }}
      >
        <Box>
          <Typography
            component="h1"
            sx={{
              fontSize: {
                xs: '1.8rem',
                md: '2.2rem',
              },
              fontWeight: 800,
              color: '#172033',
            }}
          >
            Resources
          </Typography>

          <Button
  variant="contained"
  startIcon={<CloudUploadOutlinedIcon />}
  onClick={() => {
    setUploadError('')
    setUploadOpen(true)
  }}
  sx={{
    borderRadius: 2,
    textTransform: 'none',
    fontWeight: 700,
    background:
      'linear-gradient(135deg, #3f51ff, #7c4dff)',
    '&:hover': {
      background:
        'linear-gradient(135deg, #3545e8, #6b3fe0)',
    },
  }}
>
  Upload Resource
</Button>

          <Typography
            sx={{
              mt: 0.5,
              color: '#7a8494',
              lineHeight: 1.6,
            }}
          >
            Manage files and documents
            uploaded to your projects.
          </Typography>
        </Box>

        <Chip
          icon={
            <AttachFileOutlinedIcon />
          }
          label={`${attachments.length} ${
            attachments.length === 1
              ? 'file'
              : 'files'
          }`}
          sx={{
            fontWeight: 700,
            borderRadius: 2,
            backgroundColor:
              '#ede7f6',
            color: '#6a42d8',
          }}
        />
      </Box>

     <Box
  sx={{
    mb: 3,
    display: 'flex',
    gap: 2,
    flexDirection: {
      xs: 'column',
      sm: 'row',
    },
    alignItems: {
      xs: 'stretch',
      sm: 'center',
    },
  }}
>
  {/* Search */}
  <TextField
    fullWidth
    size="small"
    placeholder="Search resources by filename..."
    value={searchTerm}
    onChange={(event) =>
      setSearchTerm(event.target.value)
    }
    sx={{
      maxWidth: {
        xs: '100%',
        sm: 520,
      },
      '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        backgroundColor: '#ffffff',
      },
    }}
  />

  {/* File Type */}
  <FormControl
    size="small"
    sx={{
      minWidth: {
        xs: '100%',
        sm: 180,
      },
    }}
  >
    <InputLabel>File type</InputLabel>

    <Select
      value={fileType}
      label="File type"
      onChange={(event) =>
        setFileType(event.target.value)
      }
      sx={{
        borderRadius: 2,
        backgroundColor: '#ffffff',
      }}
    >
      <MenuItem value="all">
        All files
      </MenuItem>

      <MenuItem value="pdf">
        PDF
      </MenuItem>

      <MenuItem value="jpg">
        JPG
      </MenuItem>

      <MenuItem value="jpeg">
        JPEG
      </MenuItem>

      <MenuItem value="png">
        PNG
      </MenuItem>

      <MenuItem value="webp">
        WEBP
      </MenuItem>

      <MenuItem value="doc">
        Word
      </MenuItem>

      <MenuItem value="docx">
        Word
      </MenuItem>

      <MenuItem value="xls">
        Excel
      </MenuItem>

      <MenuItem value="xlsx">
        Excel
      </MenuItem>

      <MenuItem value="ppt">
        PowerPoint
      </MenuItem>

      <MenuItem value="pptx">
        PowerPoint
      </MenuItem>

      <MenuItem value="txt">
        Text
      </MenuItem>

      <MenuItem value="csv">
        CSV
      </MenuItem>

      <MenuItem value="zip">
        ZIP
      </MenuItem>
    </Select>
  </FormControl>

  {/* Sort */}
  <FormControl
    size="small"
    sx={{
      minWidth: {
        xs: '100%',
        sm: 180,
      },
    }}
  >
    <InputLabel>Sort by</InputLabel>

    <Select
      value={sortBy}
      label="Sort by"
      onChange={(event) =>
        setSortBy(event.target.value)
      }
      sx={{
        borderRadius: 2,
        backgroundColor: '#ffffff',
      }}
    >
      <MenuItem value="newest">
        Newest first
      </MenuItem>

      <MenuItem value="oldest">
        Oldest first
      </MenuItem>

      <MenuItem value="nameAsc">
        Filename A–Z
      </MenuItem>

      <MenuItem value="nameDesc">
        Filename Z–A
      </MenuItem>
    </Select>
  </FormControl>
</Box>

      {/* Error */}
      {error && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            border:
              '1px solid #f3c4c4',
            backgroundColor: '#fff5f5',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#b42318',
              fontWeight: 600,
            }}
          >
            {error}
          </Typography>
        </Paper>
      )}

      {/* Empty state */}
      {attachments.length === 0 &&
        !error && (
          <Paper
            elevation={0}
            sx={{
              py: 8,
              px: 3,
              borderRadius: 3,
              border:
                '1px solid #e8eaf0',
              textAlign: 'center',
              backgroundColor:
                '#ffffff',
            }}
          >
            <InsertDriveFileOutlinedIcon
              sx={{
                fontSize: 52,
                color: '#b8c0cc',
                mb: 1.5,
              }}
            />

            <Typography
              sx={{
                fontWeight: 700,
                color: '#172033',
                mb: 0.5,
              }}
            >
              No resources yet
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: '#7a8494',
              }}
            >
              Uploaded files will
              appear here.
            </Typography>
          </Paper>
        )}

        {attachments.length > 0 &&
  filteredAttachments.length === 0 && (
    <Paper
      elevation={0}
      sx={{
        py: 6,
        px: 3,
        borderRadius: 3,
        border: '1px solid #e8eaf0',
        textAlign: 'center',
        backgroundColor: '#ffffff',
      }}
    >
      <Typography
        sx={{
          fontWeight: 700,
          color: '#172033',
          mb: 0.5,
        }}
      >
        No matching resources
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: '#7a8494',
        }}
      >
        Try searching with a different filename.
      </Typography>
    </Paper>
  )}

      {/* Resource list */}
      {filteredAttachments.length > 0 && (
  <Box
          sx={{
            display: 'flex',
            flexDirection:
              'column',
            gap: 1.5,
          }}
        >
          {filteredAttachments.map((attachment) => {
  const relatedTask = tasks.find(
    (task) => task.id === attachment.taskId
  )

  return (
   <Paper
  key={attachment.id}
  elevation={0}
  sx={{
    p: { xs: 1.5, sm: 2 },
    borderRadius: 2.5,
    border: '1px solid #e8eaf0',
    backgroundColor: '#ffffff',
    transition:
      'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow:
        '0 6px 18px rgba(23,32,51,0.07)',
    },
  }}
>
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: {
        xs: '40px minmax(0, 1fr)',
        sm: '44px minmax(0, 1fr)',
        md: '46px minmax(0, 1fr) auto',
      },
      columnGap: {
        xs: 1.25,
        sm: 1.5,
        md: 2,
      },
      rowGap: 1,
      alignItems: 'start',
      width: '100%',
    }}
  >
    {/* File icon */}
    <Box
      sx={{
        width: { xs: 40, sm: 44, md: 46 },
        height: { xs: 40, sm: 44, md: 46 },
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'linear-gradient(135deg, #e3f2fd, #ede7f6)',
      }}
    >
      <InsertDriveFileOutlinedIcon
        sx={{
          color: '#3f51ff',
          fontSize: { xs: 20, sm: 22, md: 24 },
        }}
      />
    </Box>

    {/* File information */}
    <Box
      sx={{
        minWidth: 0,
        width: '100%',
      }}
    >
      <Typography
        sx={{
          fontWeight: 700,
          color: '#172033',
          overflowWrap: 'anywhere',
          wordBreak: 'break-word',
          lineHeight: 1.4,
        }}
      >
        {attachment.filename}
      </Typography>

      {/* File metadata */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 0.75, sm: 1 },
          flexWrap: 'wrap',
          mt: 0.75,
        }}
      >
        <Chip
          label={getFileExtension(attachment.filename)}
          size="small"
          sx={{
            fontWeight: 700,
            borderRadius: 1.5,
            backgroundColor: '#ede7f6',
            color: '#5e35b1',
          }}
        />

        <Typography
          variant="caption"
          sx={{
            color: '#7a8494',
          }}
        >
          {formatFileSize(attachment.sizeBytes)}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: '#b0b7c3',
          }}
        >
          •
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: '#7a8494',
          }}
        >
          Uploaded:{' '}
          {new Date(
            attachment.createdAt
          ).toLocaleDateString()}
        </Typography>
      </Box>

      {/* Related task */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 0.75,
          mt: 0.75,
          minWidth: 0,
          width: '100%',
          flexWrap: 'wrap',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: '#7a8494',
            fontWeight: 500,
            flexShrink: 0,
          }}
        >
          Task:
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: '#172033',
            fontWeight: 600,
            minWidth: 0,
            overflowWrap: 'anywhere',
            wordBreak: 'break-word',
            flex: 1,
          }}
        >
          {relatedTask?.title ?? 'Unknown task'}
        </Typography>
      </Box>
    </Box>

    {/* Actions */}
    <Box
      sx={{
        gridColumn: {
          xs: '2',
          sm: '2',
          md: '3',
        },
        gridRow: {
          xs: '2',
          sm: '1',
          md: '1',
        },
        display: 'flex',
        gap: 0.25,
        justifyContent: {
          xs: 'flex-start',
          sm: 'flex-end',
          md: 'flex-end',
        },
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Tooltip title="Download">
        <span>
          <IconButton
            onClick={() =>
              handleDownload(attachment)
            }
            disabled={
              downloadingId === attachment.id
            }
            sx={{
              color: '#3f51ff',
              '&:hover': {
                backgroundColor:
                  'rgba(63,81,255,0.08)',
              },
            }}
          >
            {downloadingId === attachment.id ? (
              <CircularProgress size={20} />
            ) : (
              <DownloadOutlinedIcon />
            )}
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Delete">
        <span>
          <IconButton
            onClick={() =>
              handleDelete(attachment)
            }
            disabled={
              deletingId === attachment.id
            }
            sx={{
              color: '#d14343',
              '&:hover': {
                backgroundColor:
                  'rgba(209,67,67,0.08)',
              },
            }}
          >
            {deletingId === attachment.id ? (
              <CircularProgress size={20} />
            ) : (
              <DeleteOutlineIcon />
            )}
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  </Box>
</Paper>
                      )
        })}
        </Box>
      )}

      <Dialog
  open={uploadOpen}
  onClose={() => {
    if (!uploading) {
      setUploadOpen(false)
      setUploadError('')
      setSelectedTaskId('')
      setSelectedUploadFile(null)
    }
  }}
  fullWidth
  maxWidth="sm"
>
  <DialogTitle
    sx={{
      fontWeight: 700,
      color: '#172033',
    }}
  >
    Upload Resource
  </DialogTitle>

  <DialogContent>
    <FormControl
      fullWidth
      size="small"
      sx={{ mt: 1, mb: 2 }}
    >
      <InputLabel>Task</InputLabel>

      <Select
        value={selectedTaskId}
        label="Task"
        onChange={(event) =>
          setSelectedTaskId(event.target.value)
        }
        disabled={uploading}
        sx={{
          borderRadius: 2,
        }}
      >
        {tasks.map((task) => (
          <MenuItem
            key={task.id}
            value={task.id}
          >
            {task.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <Button
      component="label"
      variant="outlined"
      fullWidth
      disabled={uploading}
      sx={{
        py: 1.5,
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: 600,
      }}
    >
      {selectedUploadFile
        ? selectedUploadFile.name
        : 'Choose file'}

      <input
        type="file"
        hidden
        onChange={(event) => {
          const file =
            event.target.files?.[0] ?? null

          setSelectedUploadFile(file)
          setUploadError('')
        }}
      />
    </Button>

    {selectedUploadFile && (
      <Typography
        variant="body2"
        sx={{
          mt: 1,
          color: '#7a8494',
        }}
      >
        Selected: {selectedUploadFile.name}
      </Typography>
    )}

    {uploadError && (
      <Typography
        variant="body2"
        sx={{
          mt: 2,
          color: '#d32f2f',
          fontWeight: 500,
        }}
      >
        {uploadError}
      </Typography>
    )}
  </DialogContent>

  <DialogActions sx={{ px: 3, pb: 3 }}>
    <Button
      onClick={() => {
        setUploadOpen(false)
        setUploadError('')
        setSelectedTaskId('')
        setSelectedUploadFile(null)
      }}
      disabled={uploading}
      sx={{
        textTransform: 'none',
        fontWeight: 600,
      }}
    >
      Cancel
    </Button>

    <Button
      variant="contained"
      onClick={handleUpload}
      disabled={
        uploading ||
        !selectedTaskId ||
        !selectedUploadFile
      }
      sx={{
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: 700,
        background:
          'linear-gradient(135deg, #3f51ff, #7c4dff)',
      }}
    >
      {uploading ? 'Uploading...' : 'Upload'}
    </Button>
  </DialogActions>
</Dialog>

    </Box>
  )
}

export default Resources