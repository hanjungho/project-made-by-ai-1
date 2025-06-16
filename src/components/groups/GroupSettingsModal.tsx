import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Settings, Edit3, Copy, Users, Crown, UserMinus, Trash2, 
  Check, Clock, UserCheck, UserX, Save
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppStore } from '../../store/appStore';
import { useAuthStore } from '../../store/authStore';
import { Group, User } from '../../types';

interface GroupSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group;
}

const GroupSettingsModal: React.FC<GroupSettingsModalProps> = ({ isOpen, onClose, group }) => {
  const { user } = useAuthStore();
  const { updateGroup, leaveGroup, deleteGroup } = useAppStore();
  
  const isGroupLeader = user?.id && group.createdBy && String(user.id) === String(group.createdBy);
  
  const [activeTab, setActiveTab] = useState(isGroupLeader ? 'info' : 'members');
  const [editedGroupName, setEditedGroupName] = useState(group.name);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 임시 데이터 (실제로는 서버에서 관리)
  const [pendingRequests] = useState([
    { id: '1', name: '김철수', email: 'kim@example.com', requestedAt: new Date() },
    { id: '2', name: '이영희', email: 'lee@example.com', requestedAt: new Date() },
  ]);

  const tabs = isGroupLeader 
    ? [
        { id: 'info', label: '그룹 정보', icon: Settings },
        { id: 'members', label: '그룹원 관리', icon: Users },
        { id: 'requests', label: '가입 신청', icon: Clock },
      ]
    : [
        { id: 'members', label: '그룹원', icon: Users },
      ];

  // 그룹이나 사용자가 변경될 때 탭 재설정
  useEffect(() => {
    const newActiveTab = isGroupLeader ? 'info' : 'members';
    setActiveTab(newActiveTab);
  }, [isGroupLeader, group.id, user?.id]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(group.code);
    toast.success('참여 코드가 복사되었습니다!');
  };

  const handleSaveGroupName = () => {
    if (!editedGroupName.trim()) {
      toast.error('그룹명을 입력해주세요.');
      return;
    }
    updateGroup(group.id, { name: editedGroupName.trim() });
    setIsEditing(false);
    toast.success('그룹명이 변경되었습니다.');
  };

  const handlePromoteMember = (memberId: string) => {
    if (memberId === user?.id) return;
    
    updateGroup(group.id, { createdBy: memberId });
    toast.success('그룹장이 변경되었습니다.');
  };

  const handleKickMember = (memberId: string) => {
    const updatedMembers = group.members.filter(member => member.id !== memberId);
    updateGroup(group.id, { members: updatedMembers });
    toast.success('멤버가 추방되었습니다.');
  };

  const handleApproveRequest = (requestId: string) => {
    toast.success('가입 신청이 승인되었습니다.');
  };

  const handleRejectRequest = (requestId: string) => {
    toast.success('가입 신청이 거절되었습니다.');
  };

  const handleLeaveGroup = () => {
    leaveGroup(group.id);
    toast.success('그룹에서 탈퇴했습니다.');
    onClose();
  };

  const handleDeleteGroup = () => {
    if (showDeleteConfirm) {
      deleteGroup(group.id);
      toast.success('그룹이 삭제되었습니다.');
      onClose();
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 5000);
    }
  };

  const renderGroupInfo = () => (
    <div className="space-y-6">
      {/* 그룹명 수정 */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">그룹명</label>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-700 p-1"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSaveGroupName}
                className="text-green-600 hover:text-green-700 p-1"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedGroupName(group.name);
                }}
                className="text-gray-600 hover:text-gray-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        {isEditing ? (
          <input
            type="text"
            value={editedGroupName}
            onChange={(e) => setEditedGroupName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={30}
          />
        ) : (
          <p className="text-gray-900 font-medium">{group.name}</p>
        )}
      </div>

      {/* 참여 코드 */}
      <div className="bg-gray-50 rounded-xl p-4">
        <label className="block text-sm font-medium text-gray-700 mb-3">참여 코드</label>
        <div className="flex items-center justify-between">
          <span className="font-mono text-lg font-bold text-blue-600">{group.code}</span>
          <button
            onClick={handleCopyCode}
            className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Copy className="w-4 h-4" />
            <span className="text-sm">복사</span>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          이 코드를 통해 다른 사람들이 그룹에 참여할 수 있습니다.
        </p>
      </div>

      {/* 그룹 삭제 */}
      <div className="bg-red-50 rounded-xl p-4 border border-red-200">
        <h4 className="font-medium text-red-900 mb-2">위험 구역</h4>
        <p className="text-sm text-red-700 mb-4">
          그룹을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
        </p>
        <button
          onClick={handleDeleteGroup}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            showDeleteConfirm
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-red-100 text-red-700 hover:bg-red-200'
          }`}
        >
          <Trash2 className="w-4 h-4" />
          <span>
            {showDeleteConfirm ? '정말로 삭제하시겠습니까?' : '그룹 삭제'}
          </span>
        </button>
        {showDeleteConfirm && (
          <p className="text-xs text-red-600 mt-2">
            5초 내에 다시 클릭하면 그룹이 삭제됩니다.
          </p>
        )}
      </div>
    </div>
  );

  const renderMembers = () => (
    <div className="space-y-6">
      {/* 그룹원 리스트 */}
      <div className="space-y-4">
        {group.members && group.members.length > 0 ? (
          group.members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {member.name?.[0] || 'U'}
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{member.name}</span>
                    {member.id === group.createdBy && (
                      <Crown className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{member.email}</span>
                </div>
              </div>
              
              {isGroupLeader && member.id !== user?.id && (
                <div className="flex items-center space-x-2">
                  {member.id !== group.createdBy && (
                    <>
                      <button
                        onClick={() => handlePromoteMember(member.id)}
                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="그룹장으로 임명"
                      >
                        <Crown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleKickMember(member.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="추방"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">그룹원이 없습니다.</p>
          </div>
        )}
      </div>
      
      {/* 그룹원 전용: 그룹 탈퇴 */}
      {!isGroupLeader && (
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleLeaveGroup}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors"
          >
            <UserMinus className="w-4 h-4" />
            <span>그룹 탈퇴</span>
          </button>
        </div>
      )}
    </div>
  );

  const renderRequests = () => (
    <div className="space-y-4">
      {pendingRequests.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">대기 중인 가입 신청이 없습니다.</p>
        </div>
      ) : (
        pendingRequests.map((request) => (
          <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {request.name[0]}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-900">{request.name}</span>
                <p className="text-sm text-gray-500">{request.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleApproveRequest(request.id)}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="승인"
              >
                <UserCheck className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleRejectRequest(request.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="거절"
              >
                <UserX className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'info':
        return renderGroupInfo();
      case 'members':
        return renderMembers();
      case 'requests':
        return renderRequests();
      default:
        return renderMembers();
    }
  };

  if (!isOpen || !group) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[100]">
        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Settings className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">그룹 설정</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* 탭 */}
            <div className="border-b border-gray-200">
              <nav className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* 내용 */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {renderContent()}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default GroupSettingsModal;