import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Heart, MessageCircle, Send, Clock, Share2, Flag,
  Users, Lightbulb, MessageSquare, HelpCircle, FileText
} from 'lucide-react';
import { Post, Comment } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import toast from 'react-hot-toast';
import ReportModal from './ReportModal';

interface PostDetailProps {
  post: Post;
  onBack: () => void;
}

const PostDetail: React.FC<PostDetailProps> = ({ post, onBack }) => {
  const { user } = useAuthStore();
  const { updatePost } = useAppStore();
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [reportModal, setReportModal] = useState<{
    isOpen: boolean;
    type: 'post' | 'comment';
    targetId: string;
    targetTitle?: string;
  }>({
    isOpen: false,
    type: 'post',
    targetId: '',
    targetTitle: ''
  });

  const getCategoryInfo = (category: string) => {
    const categories: Record<string, { name: string; icon: any; color: string }> = {
      roommate: { name: '메이트 구하기', icon: Users, color: 'bg-blue-100 text-blue-800' },
      tip: { name: '생활팁', icon: Lightbulb, color: 'bg-yellow-100 text-yellow-800' },
      free: { name: '자유게시판', icon: MessageSquare, color: 'bg-purple-100 text-purple-800' },
      question: { name: '질문/답변', icon: HelpCircle, color: 'bg-red-100 text-red-800' },
      policy: { name: '정책', icon: FileText, color: 'bg-green-100 text-green-800' },
    };
    return categories[category] || { name: '기타', icon: FileText, color: 'bg-gray-100 text-gray-800' };
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user) return;

    setIsSubmittingComment(true);

    try {
      const comment: Comment = {
        id: Date.now().toString(),
        content: newComment.trim(),
        userId: user.id,
        author: user,
        createdAt: new Date(),
      };

      const updatedComments = [...(post.comments || []), comment];
      updatePost(post.id, { comments: updatedComments });
      setNewComment('');
      toast.success('댓글이 작성되었습니다.');
    } catch (error) {
      toast.error('댓글 작성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.content.substring(0, 100) + '...',
          url: window.location.href,
        });
      } else {
        // 폴백: URL을 클립보드에 복사
        await navigator.clipboard.writeText(window.location.href);
        toast.success('링크가 클립보드에 복사되었습니다.');
      }
    } catch (error) {
      // 클립보드 복사 시도
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('링크가 클립보드에 복사되었습니다.');
      } catch (clipboardError) {
        toast.error('공유하기를 실행할 수 없습니다.');
      }
    }
  };

  const handleReportPost = () => {
    setReportModal({
      isOpen: true,
      type: 'post',
      targetId: post.id,
      targetTitle: post.title
    });
  };

  const handleReportComment = (commentId: string) => {
    setReportModal({
      isOpen: true,
      type: 'comment',
      targetId: commentId,
      targetTitle: `${post.title}의 댓글`
    });
  };

  const closeReportModal = () => {
    setReportModal({
      isOpen: false,
      type: 'post',
      targetId: '',
      targetTitle: ''
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 뒤로가기 헤더 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center space-x-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>목록으로</span>
        </motion.button>
      </motion.div>

      {/* 게시글 상세 */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {post.author?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-900">
                {post.author?.name || '익명'}
              </span>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ko })}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {(() => {
              const categoryInfo = getCategoryInfo(post.category);
              return (
                <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                  <categoryInfo.icon className="w-3 h-3" />
                  <span>{categoryInfo.name}</span>
                </div>
              );
            })()}
          </div>
        </div>

        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">
          {post.content}
        </p>

        {/* 태그 */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 액션 버튼들 */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-gray-500">
              <Heart className="w-5 h-5" />
              <span>{post.likes || 0}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <MessageCircle className="w-5 h-5" />
              <span>{post.comments?.length || 0}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="flex items-center space-x-1 px-3 py-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm">공유</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReportPost}
              className="flex items-center space-x-1 px-3 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Flag className="w-4 h-4" />
              <span className="text-sm">신고</span>
            </motion.button>
          </div>
        </div>
      </motion.article>

      {/* 댓글 섹션 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          댓글 {post.comments?.length || 0}개
        </h3>

        {/* 댓글 작성 */}
        <div className="flex space-x-4 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 작성해보세요..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              maxLength={500}
            />
            <div className="flex items-center justify-between mt-3">
              <div className="text-xs text-gray-500">
                {newComment.length}/500
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmitComment}
                disabled={isSubmittingComment || !newComment.trim()}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmittingComment ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>작성 중...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>댓글 작성</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* 댓글 목록 */}
        <div className="space-y-4">
          {post.comments && post.comments.length > 0 ? (
            post.comments
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((comment, index) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex space-x-4 p-4 bg-gray-50 rounded-xl"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-xs">
                      {comment.author?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 text-sm">
                          {comment.author?.name || '익명'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ko })}
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleReportComment(comment.id)}
                        className="flex items-center space-x-1 px-2 py-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Flag className="w-3 h-3" />
                        <span className="text-xs">신고</span>
                      </motion.button>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </motion.div>
              ))
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">첫 번째 댓글을 작성해보세요!</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* 신고 모달 */}
      <ReportModal
        isOpen={reportModal.isOpen}
        onClose={closeReportModal}
        type={reportModal.type}
        targetId={reportModal.targetId}
        targetTitle={reportModal.targetTitle}
      />
    </div>
  );
};

export default PostDetail;