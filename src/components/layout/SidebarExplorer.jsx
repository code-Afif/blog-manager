import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { postService } from '../../lib/postService';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useScrambleText } from '../../hooks/useScrambleText';
import {
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  ChevronRight,
  ChevronDown,
  Bookmark,
  Plus,
  Hash,
  Layers,
  Settings,
  Archive,
  RefreshCw,
} from 'lucide-react';

function FolderItem({ folderName, posts, activeSlug, onSelectFile }) {
  const [isOpen, setIsOpen] = useState(true);
  const { displayText, trigger } = useScrambleText(folderName + '/');

  return (
    <div style={{ marginBottom: '2px' }}>
      {/* Folder Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={trigger}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '4px 8px 4px 6px',
          borderRadius: 'var(--radius-1)',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          fontSize: '11px',
          userSelect: 'none',
          transition: 'color var(--duration-fast)',
        }}
        onMouseOver={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
        onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
      >
        {isOpen ? <ChevronDown size={11} style={{ opacity: 0.6 }} /> : <ChevronRight size={11} style={{ opacity: 0.6 }} />}
        {isOpen ? <FolderOpen size={13} style={{ color: 'var(--accent)' }} /> : <Folder size={13} style={{ color: 'var(--accent)' }} />}
        <span style={{ fontWeight: 600, letterSpacing: '0.02em' }}>{displayText}</span>
        <span className="tabular-nums" style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--text-subtle)' }}>
          {posts.length}
        </span>
      </div>

      {/* Folder Files List */}
      {isOpen && (
        <div style={{ paddingLeft: '14px', borderLeft: '1px solid var(--border-subtle)', marginLeft: '10px' }}>
          {posts.map((post) => {
            const isActive = activeSlug === post.slug;
            return (
              <div
                key={post.id}
                onClick={() => onSelectFile(post)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-1)',
                  cursor: 'pointer',
                  fontSize: '11px',
                  backgroundColor: isActive ? 'var(--bg-surface-active)' : 'transparent',
                  borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'background-color var(--duration-fast)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <FileCode size={12} style={{ color: isActive ? 'var(--accent)' : 'var(--text-subtle)', flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {post.filename}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function SidebarExplorer() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    openTab,
    sidebarView,
    setSidebarView,
    stashedIds,
    postsVersion,
  } = useWorkspaceStore();

  const [folders, setFolders] = useState({});
  const [allPosts, setAllPosts] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    Promise.all([postService.getFolders(), postService.getAll(), postService.getTags()]).then(
      ([folderMap, posts, tagList]) => {
        setFolders(folderMap);
        setAllPosts(posts);
        setTags(tagList);
      }
    );
  }, [postsVersion]);

  // Current active post slug from URL
  const activeSlug = location.pathname.startsWith('/posts/')
    ? location.pathname.replace('/posts/', '')
    : null;

  const handleSelectFile = (post) => {
    openTab({
      id: post.id,
      slug: post.slug,
      title: post.filename,
      type: 'post',
    });
    navigate(`/posts/${post.slug}`);
  };

  const handleSelectReadme = () => {
    openTab({
      id: 'readme',
      slug: 'README.md',
      title: 'README.md',
      type: 'readme',
      isPinned: true,
    });
    navigate('/');
  };

  const handleSelectMyPosts = () => {
    openTab({
      id: 'my-posts',
      slug: 'my-posts',
      title: 'my-posts.sh',
      type: 'myposts',
    });
    navigate('/my-posts');
  };

  // Stashed posts
  const stashedPosts = allPosts.filter((p) => stashedIds.includes(p.id));

  return (
    <aside
      style={{
        display: 'flex',
        height: '100%',
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-default)',
        fontFamily: 'var(--font-mono)',
        overflow: 'hidden',
      }}
    >
      {/* Activity Icon Rail (VS Code style activity bar) */}
      <div
        style={{
          width: '42px',
          backgroundColor: 'var(--bg-canvas)',
          borderRight: '1px solid var(--border-default)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '8px',
          gap: '6px',
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={() => setSidebarView('explorer')}
          aria-label="Files Explorer"
          title="File Explorer"
          style={{
            padding: '7px',
            color: sidebarView === 'explorer' ? 'var(--accent)' : 'var(--text-muted)',
            backgroundColor: sidebarView === 'explorer' ? 'var(--bg-surface)' : 'transparent',
            borderLeft: sidebarView === 'explorer' ? '2px solid var(--accent)' : '2px solid transparent',
            borderRadius: 'var(--radius-1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Folder size={16} />
        </button>

        <button
          type="button"
          onClick={() => setSidebarView('bookmarks')}
          aria-label="Stash Bookmarks"
          title={`Stashed Bookmarks (${stashedIds.length})`}
          style={{
            padding: '7px',
            color: sidebarView === 'bookmarks' ? 'var(--accent)' : 'var(--text-muted)',
            backgroundColor: sidebarView === 'bookmarks' ? 'var(--bg-surface)' : 'transparent',
            borderLeft: sidebarView === 'bookmarks' ? '2px solid var(--accent)' : '2px solid transparent',
            borderRadius: 'var(--radius-1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Bookmark size={16} fill={stashedIds.length > 0 ? 'currentColor' : 'none'} />
        </button>

        <button
          type="button"
          onClick={() => setSidebarView('tags')}
          aria-label="Topic Tags"
          title="Topic Tags Index"
          style={{
            padding: '7px',
            color: sidebarView === 'tags' ? 'var(--accent)' : 'var(--text-muted)',
            backgroundColor: sidebarView === 'tags' ? 'var(--bg-surface)' : 'transparent',
            borderLeft: sidebarView === 'tags' ? '2px solid var(--accent)' : '2px solid transparent',
            borderRadius: 'var(--radius-1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Hash size={16} />
        </button>

        <button
          type="button"
          onClick={handleSelectMyPosts}
          aria-label="Manage My Posts"
          title="Management Console (My Posts)"
          style={{
            padding: '7px',
            color: location.pathname === '/my-posts' ? 'var(--accent)' : 'var(--text-muted)',
            backgroundColor: location.pathname === '/my-posts' ? 'var(--bg-surface)' : 'transparent',
            borderLeft: location.pathname === '/my-posts' ? '2px solid var(--accent)' : '2px solid transparent',
            borderRadius: 'var(--radius-1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Settings size={16} />
        </button>
      </div>

      {/* Explorer Tree Body */}
      <div
        style={{
          width: '218px',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            borderBottom: '1px solid var(--border-default)',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          <span>
            {sidebarView === 'explorer' && 'EXPLORER // FILES'}
            {sidebarView === 'bookmarks' && `STASH (${stashedIds.length})`}
            {sidebarView === 'tags' && 'TAGS INDEX'}
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>
            {allPosts.length} OBJ
          </span>
        </div>

        {/* Tree Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {sidebarView === 'explorer' && (
            <div>
              {/* Root Readme */}
              <div
                onClick={handleSelectReadme}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-1)',
                  cursor: 'pointer',
                  fontSize: '11px',
                  backgroundColor: location.pathname === '/' ? 'var(--bg-surface-active)' : 'transparent',
                  borderLeft: location.pathname === '/' ? '2px solid var(--accent)' : '2px solid transparent',
                  color: location.pathname === '/' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: location.pathname === '/' ? 600 : 400,
                  marginBottom: '6px',
                }}
              >
                <FileText size={13} style={{ color: 'var(--accent)' }} />
                <span>README.md</span>
                <span style={{ marginLeft: 'auto', fontSize: '9px', color: 'var(--text-subtle)' }}>PINNED</span>
              </div>

              {/* Management shell script */}
              <div
                onClick={handleSelectMyPosts}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-1)',
                  cursor: 'pointer',
                  fontSize: '11px',
                  backgroundColor: location.pathname === '/my-posts' ? 'var(--bg-surface-active)' : 'transparent',
                  borderLeft: location.pathname === '/my-posts' ? '2px solid var(--accent)' : '2px solid transparent',
                  color: location.pathname === '/my-posts' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: location.pathname === '/my-posts' ? 600 : 400,
                  marginBottom: '10px',
                }}
              >
                <Settings size={13} style={{ color: 'var(--text-muted)' }} />
                <span>my-posts.sh</span>
              </div>

              {/* Folders */}
              {Object.entries(folders).map(([folderName, postsInFolder]) => (
                <FolderItem
                  key={folderName}
                  folderName={folderName}
                  posts={postsInFolder}
                  activeSlug={activeSlug}
                  onSelectFile={handleSelectFile}
                />
              ))}
            </div>
          )}

          {sidebarView === 'bookmarks' && (
            <div>
              {stashedPosts.length === 0 ? (
                <div style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '11px', lineHeight: 1.5 }}>
                  git stash is empty. Click stash on any article to keep it handy.
                </div>
              ) : (
                stashedPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => handleSelectFile(post)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      padding: '6px 8px',
                      borderRadius: 'var(--radius-1)',
                      cursor: 'pointer',
                      borderBottom: '1px solid var(--border-subtle)',
                      fontSize: '11px',
                    }}
                  >
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{post.title}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{post.filename}</div>
                  </div>
                ))
              )}
            </div>
          )}

          {sidebarView === 'tags' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {tags.map(({ tag, count }) => (
                <div
                  key={tag}
                  onClick={() => navigate(`/?tag=${tag}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-1)',
                    cursor: 'pointer',
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <span>#{tag}</span>
                  <span className="tabular-nums" style={{ color: 'var(--text-subtle)', fontSize: '10px' }}>
                    {count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
