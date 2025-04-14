import React from 'react'
import { useMessageInput } from '@/hooks/useMessageInput'
import AttachmentPreview from './AttachmentPreview'
import EmojiPicker from './EmojiPicker'
import ActionButtons from './ActionButtons'
import SendButton from './SendButton'
import RecordButton from './RecordButton'

interface MessageInputProps {
    message: string
    setMessage: React.Dispatch<React.SetStateAction<string>>
    sendTyping: () => void
    sendSeen: () => void
    sendMessage: () => void
    isDisabled: boolean
}

const MessageInput: React.FC<MessageInputProps> = (props) => {
    const {
        showEmojiPicker,
        attachments,
        isRecording,
        fileInputRef,
        handleInputChange,
        handleKeyDown,
        handleSendMessage,
        insertEmoji,
        handleFileChange,
        removeAttachment,
        triggerFileInput,
        toggleRecording,
        toggleEmojiPicker,
    } = useMessageInput(props)

    return (
        <div className="relative">
            {/* Attachments preview */}
            <AttachmentPreview
                attachments={attachments}
                removeAttachment={removeAttachment}
            />

            {/* Input area */}
            <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200">
                <ActionButtons
                    toggleEmojiPicker={toggleEmojiPicker}
                    triggerFileInput={triggerFileInput}
                />

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                />

                <input
                    className="flex-1 px-4 py-3 bg-transparent focus:outline-none text-gray-700"
                    value={props.message}
                    onChange={handleInputChange}
                    placeholder="Type a message..."
                    disabled={props.isDisabled}
                    onKeyDown={handleKeyDown}
                    onFocus={props.sendSeen}
                />

                <div className="flex items-center mr-2 gap-1">
                    <RecordButton
                        isRecording={isRecording}
                        toggleRecording={toggleRecording}
                    />

                    <SendButton
                        isDisabled={props.isDisabled}
                        message={props.message}
                        attachments={attachments}
                        handleSendMessage={handleSendMessage}
                    />
                </div>
            </div>

            {/* Emoji picker */}
            <EmojiPicker
                showEmojiPicker={showEmojiPicker}
                insertEmoji={insertEmoji}
            />
        </div>
    )
}

export default MessageInput
