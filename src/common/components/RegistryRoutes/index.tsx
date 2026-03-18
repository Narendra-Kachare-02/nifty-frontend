import { Routes, Route, Navigate } from 'react-router';

type BaseEntry = { path: string; element: React.ReactNode };
type EntryWithWrap = BaseEntry & { wrapWithErrorBoundary?: boolean };

interface RegistryRoutesProps {
  entries: EntryWithWrap[];
  fallbackPath: string;
  /** Wrap elements when wrapWithErrorBoundary is true (e.g. DashboardErrorBoundary) */
  ErrorBoundary?: React.ComponentType<{ children: React.ReactNode }>;
}

/** Renders Routes from a screen registry. Add entries to config – no Route boilerplate. */
export const RegistryRoutes: React.FC<RegistryRoutesProps> = ({
  entries,
  fallbackPath,
  ErrorBoundary,
}) => {
  return (
    <Routes>
      {entries.map(({ path, element, wrapWithErrorBoundary }) => {
        const wrapped =
          wrapWithErrorBoundary && ErrorBoundary ? (
            <ErrorBoundary>{element}</ErrorBoundary>
          ) : (
            element
          );
        return <Route key={path} path={path} element={wrapped} />;
      })}
      <Route path="*" element={<Navigate to={fallbackPath} replace />} />
    </Routes>
  );
};
